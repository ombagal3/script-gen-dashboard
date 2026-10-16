import { useState, useCallback, useEffect } from 'react';
import { scriptService } from '../services/scriptService';

export const useScripts = (initialParams = {}) => {
  const [scripts, setScripts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchScripts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await scriptService.getScripts({ ...initialParams, ...params });
      setScripts(data.scripts || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to fetch scripts');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(initialParams)]);

  const saveScript = async (scriptData) => {
    setIsLoading(true);
    try {
      let saved;
      if (scriptData._id || scriptData.id) {
        saved = await scriptService.updateScript(scriptData._id || scriptData.id, scriptData);
        setScripts((prev) =>
          prev.map((s) => ((s._id || s.id) === (saved._id || saved.id) ? saved : s))
        );
        showToast('Script updated successfully');
      } else {
        saved = await scriptService.createScript(scriptData);
        setScripts((prev) => [saved, ...prev]);
        showToast('Script saved to database');
      }
      return saved;
    } catch (err) {
      showToast(err.message || 'Failed to save script', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScript = async (id) => {
    try {
      await scriptService.deleteScript(id);
      setScripts((prev) => prev.filter((s) => (s._id || s.id) !== id));
      showToast('Script deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete script', 'error');
      throw err;
    }
  };

  const duplicateScript = async (id) => {
    try {
      const duplicated = await scriptService.duplicateScript(id);
      setScripts((prev) => [duplicated, ...prev]);
      showToast('Script duplicated as Draft');
      return duplicated;
    } catch (err) {
      showToast(err.message || 'Failed to duplicate script', 'error');
      throw err;
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const updated = await scriptService.updateScript(id, { status: newStatus });
      setScripts((prev) =>
        prev.map((s) => ((s._id || s.id) === id ? { ...s, status: newStatus } : s))
      );
      showToast(`Status updated to ${newStatus}`);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return {
    scripts,
    setScripts,
    pagination,
    isLoading,
    error,
    toast,
    showToast,
    fetchScripts,
    saveScript,
    deleteScript,
    duplicateScript,
    updateStatus,
  };
};
