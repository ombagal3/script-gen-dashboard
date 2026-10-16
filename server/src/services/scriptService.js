import { Script } from '../models/Script.js';
import { ApiError } from '../utils/ApiError.js';

let inMemoryScripts = [];

export const scriptService = {
  async getScripts({ userId = null, guestId = null, module, category, objective, status, language, search, sortBy = 'newest', page = 1, limit = 20 }) {
    try {
      const filter = {};

      if (userId) {
        filter.userId = userId;
      } else if (guestId) {
        filter.$or = [{ guestId }, { userId: null }];
      }

      if (module && module !== 'all') filter.module = module;
      if (category && category !== 'all') filter.category = category;
      if (objective && objective !== 'all') filter.objective = objective;
      if (status && status !== 'all') filter.status = status;
      if (language && language !== 'all') filter.language = language;

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { hook: regex },
          { body: regex },
          { cta: regex },
          { fullContent: regex },
          { category: regex },
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
      if (sortBy === 'recently-updated') sortOptions = { updatedAt: -1 };
      if (sortBy === 'title-asc') sortOptions = { title: 1 };

      const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
      const limitVal = parseInt(limit, 10);

      const [scripts, total] = await Promise.all([
        Script.find(filter).sort(sortOptions).skip(skip).limit(limitVal),
        Script.countDocuments(filter),
      ]);

      if (scripts.length > 0 || total > 0) {
        return {
          scripts,
          pagination: {
            page: parseInt(page, 10),
            limit: limitVal,
            total,
            pages: Math.ceil(total / limitVal),
          },
        };
      }
    } catch (err) {
      console.warn('[ScriptService] DB find failed, checking in-memory store:', err.message);
    }

    // Fallback in-memory filter & sort
    let filtered = [...inMemoryScripts];
    if (module && module !== 'all') filtered = filtered.filter((s) => s.module === module);
    if (category && category !== 'all') filtered = filtered.filter((s) => s.category === category);
    if (objective && objective !== 'all') filtered = filtered.filter((s) => s.objective === objective);
    if (status && status !== 'all') filtered = filtered.filter((s) => s.status === status);
    if (language && language !== 'all') filtered = filtered.filter((s) => s.language === language);
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((s) =>
        s.title?.toLowerCase().includes(q) ||
        s.hook?.toLowerCase().includes(q) ||
        s.body?.toLowerCase().includes(q) ||
        s.fullContent?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'recently-updated') filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    else if (sortBy === 'title-asc') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = filtered.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return {
      scripts: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    };
  },

  async getScriptById(id, userId = null, guestId = null) {
    try {
      const script = await Script.findById(id);
      if (script) return script;
    } catch {
      // Ignore cast error and check fallback
    }

    const mem = inMemoryScripts.find((s) => s._id?.toString() === id || s.id === id);
    if (!mem) throw new ApiError(404, 'Script not found');
    return mem;
  },

  async createScript(data, userId = null, guestId = null) {
    const scriptData = {
      ...data,
      userId,
      guestId,
      fullContent: data.fullContent || `[HOOK]\n${data.hook || ''}\n\n[BODY]\n${data.body || ''}\n\n[CTA]\n${data.cta || ''}`,
    };

    try {
      const newScript = await Script.create(scriptData);
      return newScript;
    } catch (err) {
      console.warn('[ScriptService] DB create failed, saving in memory:', err.message);
      const newMem = {
        _id: `mem_script_${Date.now()}`,
        ...scriptData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryScripts.unshift(newMem);
      return newMem;
    }
  },

  async updateScript(id, data, userId = null, guestId = null) {
    const updatePayload = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.hook || data.body || data.cta) {
      updatePayload.fullContent = data.fullContent || `[HOOK]\n${data.hook || ''}\n\n[BODY]\n${data.body || ''}\n\n[CTA]\n${data.cta || ''}`;
    }

    try {
      const script = await Script.findById(id);
      if (script) {
        if (userId && script.userId && script.userId.toString() !== userId.toString()) {
          throw new ApiError(403, 'Unauthorized to modify this script');
        }
        Object.assign(script, updatePayload);
        await script.save();
        return script;
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
    }

    const idx = inMemoryScripts.findIndex((s) => s._id?.toString() === id || s.id === id);
    if (idx !== -1) {
      inMemoryScripts[idx] = { ...inMemoryScripts[idx], ...updatePayload };
      return inMemoryScripts[idx];
    }

    throw new ApiError(404, 'Script not found');
  },

  async duplicateScript(id, userId = null, guestId = null) {
    const sourceScript = await this.getScriptById(id, userId, guestId);
    const sourceObj = sourceScript.toObject ? sourceScript.toObject() : { ...sourceScript };

    delete sourceObj._id;
    delete sourceObj.id;
    delete sourceObj.createdAt;
    delete sourceObj.updatedAt;

    sourceObj.title = `${sourceObj.title} (Copy)`;
    sourceObj.status = 'Draft';

    return await this.createScript(sourceObj, userId, guestId);
  },

  async deleteScript(id, userId = null, guestId = null) {
    try {
      const script = await Script.findById(id);
      if (script) {
        if (userId && script.userId && script.userId.toString() !== userId.toString()) {
          throw new ApiError(403, 'Unauthorized to delete this script');
        }
        await script.deleteOne();
        return { message: 'Script deleted successfully' };
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
    }

    const idx = inMemoryScripts.findIndex((s) => s._id?.toString() === id || s.id === id);
    if (idx !== -1) {
      inMemoryScripts.splice(idx, 1);
      return { message: 'Script deleted successfully' };
    }

    throw new ApiError(404, 'Script not found');
  },

  async getDashboardStats(userId = null, guestId = null) {
    const filter = {};
    if (userId) filter.userId = userId;
    else if (guestId) filter.$or = [{ guestId }, { userId: null }];

    try {
      const [
        totalScripts,
        personalBrandingScripts,
        metaAdsScripts,
        storyMarketingScripts,
        draftScripts,
        readyScripts,
        publishedScripts,
        archivedScripts,
      ] = await Promise.all([
        Script.countDocuments(filter),
        Script.countDocuments({ ...filter, module: 'personal-branding' }),
        Script.countDocuments({ ...filter, module: 'meta-ads' }),
        Script.countDocuments({ ...filter, module: 'story-marketing' }),
        Script.countDocuments({ ...filter, status: 'Draft' }),
        Script.countDocuments({ ...filter, status: 'Ready' }),
        Script.countDocuments({ ...filter, status: 'Published' }),
        Script.countDocuments({ ...filter, status: 'Archived' }),
      ]);

      if (totalScripts > 0) {
        return {
          totalScripts,
          personalBrandingScripts,
          metaAdsScripts,
          storyMarketingScripts,
          draftScripts,
          readyScripts,
          publishedScripts,
          archivedScripts,
        };
      }
    } catch {
      // Fall through to in-memory stats
    }

    return {
      totalScripts: inMemoryScripts.length,
      personalBrandingScripts: inMemoryScripts.filter((s) => s.module === 'personal-branding').length,
      metaAdsScripts: inMemoryScripts.filter((s) => s.module === 'meta-ads').length,
      storyMarketingScripts: inMemoryScripts.filter((s) => s.module === 'story-marketing').length,
      draftScripts: inMemoryScripts.filter((s) => s.status === 'Draft').length,
      readyScripts: inMemoryScripts.filter((s) => s.status === 'Ready').length,
      publishedScripts: inMemoryScripts.filter((s) => s.status === 'Published').length,
      archivedScripts: inMemoryScripts.filter((s) => s.status === 'Archived').length,
    };
  },

  async getRecentScripts(userId = null, guestId = null, limit = 6) {
    try {
      const filter = {};
      if (userId) filter.userId = userId;
      else if (guestId) filter.$or = [{ guestId }, { userId: null }];

      const recents = await Script.find(filter).sort({ updatedAt: -1 }).limit(parseInt(limit, 10));
      if (recents.length > 0) return recents;
    } catch {
      // Fall through
    }

    return [...inMemoryScripts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, limit);
  },
};
