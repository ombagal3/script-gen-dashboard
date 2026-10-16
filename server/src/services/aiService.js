import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { geminiProvider } from '../integrations/geminiProvider.js';
import { getLanguagePromptInstruction, normalizeLanguage } from '../utils/languageHelper.js';

/**
 * Intelligent Demo Generator produces realistic, high-converting scripts
 * tailored to modules, categories, languages, methods, and duration.
 */
class IntelligentDemoEngine {
  generatePersonalBranding(input, method) {
    const {
      title = 'Personal Branding Script',
      category = 'Business Owner',
      topic = 'Building authority in your industry',
      targetAudience = 'Entrepreneurs and creators',
      platform = 'Instagram Reels',
      language = 'English',
      duration = 60,
      tone = 'Authoritative yet relatable',
      goal = 'Authority and Trust',
      additionalInstructions = '',
    } = input;

    const methodName = method?.name || 'Hook → Problem → Explanation → Solution → CTA';

    let hooks = [
      `Most ${category}s make this one deadly mistake that costs them 80% of their reach—and nobody is talking about it.`,
      `If you're a ${targetAudience.toLowerCase()} trying to master ${topic.toLowerCase()}, stop scrolling right now.`,
      `Here is the exact framework I used to solve ${topic.toLowerCase()} without burning out or wasting months.`,
    ];

    if (language.toLowerCase() === 'hinglish') {
      hooks = [
        `Agar aap ek ${category} ho, toh yeh 1 galti aapka 80% reach waste kar rahi hai. Let's fix it!`,
        `Kya aap bhi ${topic.toLowerCase()} mein struggle kar rahe ho? Yeh 60-second rule aapka game badal dega.`,
        `Sach bataun? Log aapko follow isliye nahi karte kyunki aap yeh fundamental step miss kar rahe ho.`,
      ];
    } else if (language.toLowerCase() === 'gujarati') {
      hooks = [
        `જો તમે એક ${category} છો, તો આ 1 ભૂલ તમારા 80% ગ્રોથ અને પરિણામોને અટકાવી રહી છે. ચાલો સુધારીએ!`,
        `શું તમે પણ ${topic.toLowerCase()} માં મુશ્કેલી અનુભવી રહ્યા છો? આ 60-સેકન્ડનો નિયમ તમારો ગેમ બદલી દેશે.`,
        `સાચું કહું? લોકો તમને ફોલો એટલા માટે નથી કરતા કારણ કે તમે આ મૂળભૂત પગલું ચૂકી રહ્યા છો.`,
      ];
    } else if (language.toLowerCase() === 'marathi') {
      hooks = [
        `जर तुम्ही एक ${category} असाल, तर ही 1 चूक तुमचे 80% यश रोखत आहे. चला ती सुधारूया!`,
        `तुम्ही सुद्धा ${topic.toLowerCase()} मध्ये अडखळत आहात का? हा 60-सेकंद नियम तुमचा गेम बदलेल.`,
        `खरं सांगू? लोक तुम्हाला फॉलो करत नाहीत कारण तुम्ही ही मूलभूत पायरी चुकवत आहात.`,
      ];
    } else if (language.toLowerCase() === 'hindi') {
      hooks = [
        `यदि आप एक ${category} हैं, तो यह एक गलती आपका करियर और विश्वसनीयता दोनों नुकसान पहुंचा सकती है।`,
        `क्या आप ${topic} को लेकर उलझन में हैं? जानिए यह आसान 3-स्टेप फॉर्मूला।`,
        `99% लोग यहाँ गलती करते हैं जब बात आती है ${topic} की।`,
      ];
    }

    let body;
    if (language.toLowerCase() === 'hinglish') {
      body = `Step 1: Pehle problem ko identify karo. Jab aap bina clarity ke ${topic} try karte ho, toh audience connect nahi hoti.\n\nStep 2: Authenticity lao. Apne real experiences aur case studies share karo. Jaise jab maine first time start kiya tha, toh sabse bada challenge credibility ka tha.\n\nStep 3: Clear action plan do. Apne audience ko 1 specific practical tip do jo woh aaj hi apply kar sakein.\n\nYeh approach aapko directly expert status deliver karta hai bina kisi aggressive selling ke.`;
    } else if (language.toLowerCase() === 'gujarati') {
      body = `પગલું 1: પહેલા મૂળ સમસ્યાને ઓળખો. જ્યારે તમે સ્પષ્ટતા વગર ${topic} કરવાનો પ્રયાસ કરો છો, ત્યારે ઑડિયન્સ કનેક્ટ નથી થઈ શકતી.\n\nપગલું 2: વાસ્તવિકતા લાવો. તમારા સાચા અનુભવો અને કેસ સ્ટડી શેર કરો. જેમ કે જ્યારે મેં પહેલીવાર શરૂ કર્યું, ત્યારે સૌથી મોટો પડકાર વિશ્વસનીયતાનો હતો.\n\nપગલું 3: સ્પષ્ટ કાર્ય યોજના આપો. તમારી ઑડિયન્સને 1 એવી વ્યવહારુ ટિપ આપો જે તેઓ આજે જ લાગુ કરી શકે.\n\nઆ અભિગમ તમને કોઈ પણ આક્રમક વેચાણ વિના સીધા જ એક્સપર્ટ તરીકે પ્રસ્થાપિત કરે છે.`;
    } else if (language.toLowerCase() === 'marathi') {
      body = `पायरी 1: आधी मूळ अडचण ओळखा. जेव्हा तुम्ही स्पष्टतेशिवाय ${topic} करता, तेव्हा प्रेक्षक कनेक्ट होत नाहीत.\n\nपायरी 2: अस्सलपणा आणा. तुमचे खरे अनुभव आणि केस स्टडीज सामायिक करा. जसे मी सुरुवातीला सुरू केले, तेव्हा विश्वासार्हतेचे सर्वात मोठे आव्हान होते.\n\nपायरी 3: स्पष्ट कृती योजना द्या. प्रेक्षकांना 1 अशी व्यावहारिक टीप द्या जी ते आजच वापरू शकतील.\n\nहा दृष्टिकोन कोणत्याही आक्रमक विक्रीशिवाय थेट तज्ज्ञ स्थान मिळवून देतो.`;
    } else if (language.toLowerCase() === 'hindi') {
      body = `स्टेप 1: पहले मुख्य समस्या को पहचानें। जब आप स्पष्ट योजना के बिना ${topic} करते हैं, तो दर्शक आपसे जुड़ नहीं पाते।\n\nस्टेप 2: प्रामाणिकता लाएं। अपने वास्तविक अनुभव और केस स्टडीज साझा करें। शुरुआत में सबसे बड़ी चुनौती विश्वसनीयता स्थापित करने की होती है।\n\nस्टेप 3: स्पष्ट कार्य योजना दें। अपने दर्शकों को 1 ऐसा व्यावहारिक सुझाव दें जिसे वे आज ही लागू कर सकें।\n\nयह दृष्टिकोण बिना किसी आक्रामक बिक्री के आपको सीधे विशेषज्ञ के रूप में स्थापित करता है।`;
    } else {
      body = `Here is the breakdown:\n\n1. The Core Bottleneck: When most people tackle ${topic.toLowerCase()}, they focus on vanity metrics instead of core value.\n\n2. The Mindset Shift: Real authority isn't about bragging; it's about breaking down complex concepts so clearly that your audience feels understood.\n\n3. The Framework: Focus on high-signal insights. In my experience with ${category.toLowerCase()} practices, documenting the unglamorous truths creates 10x more trust than polished perfection.\n\nApply this exact framework for the next 14 days and watch your audience transform into brand advocates.`;
    }

    let cta;
    if (language.toLowerCase() === 'hinglish') {
      cta = `Agar yeh insight useful laga, toh abhi follow karein aur comment mein apna sabse bada question drop karein!`;
    } else if (language.toLowerCase() === 'gujarati') {
      cta = `જો આ માહિતી ઉપયોગી લાગી હોય, તો હમણાં જ ફોલો કરો અને કમેન્ટમાં તમારો સૌથી મોટો પ્રશ્ન પૂછો!`;
    } else if (language.toLowerCase() === 'marathi') {
      cta = `ही माहिती उपयुक्त वाटल्यास आत्ताच फॉलो करा आणि कमेंटमध्ये तुमचा प्रश्न नक्की विचारा!`;
    } else if (language.toLowerCase() === 'hindi') {
      cta = `यदि यह जानकारी उपयोगी लगी, तो अभी फॉलो करें और कमेंट में अपना सवाल ज़रूर पूछें!`;
    } else {
      cta = `Save this post so you don't lose it, and tap follow for daily actionable strategies for ${targetAudience.toLowerCase()}.`;
    }

    const onScreenText = [
      '[0:00 - 0:03] Stop making this mistake!',
      '[0:03 - 0:15] The 3-Step Reality Check',
      '[0:15 - 0:40] Why Authenticity Wins',
      '[0:40 - 0:55] Actionable Blueprint',
      '[0:55 - 1:00] Save & Follow for more',
    ];

    const bRoll = [
      'Close-up of speaker looking directly into lens with serious, engaging expression.',
      'Cut to B-roll: typing on laptop / reviewing documents with subtle background blur.',
      'Cut back to speaker gesturing with hands for emphasis.',
      'Screen recording or paper diagram demonstrating the 3-step shift.',
      'Final smiling shot with subtle pointing toward the follow/save icon.',
    ];

    const caption = `Stop overcomplicating ${topic.toLowerCase()}.\n\nWhen I first started as a ${category}, I thought you needed massive budgets or secrets to build ${goal.toLowerCase()}.\n\nTruth is: transparency + clear frameworks always beat fancy tricks.\n\nSave this for your next project, and share your thoughts below! 👇\n\n#${category.replace(/\s+/g, '')} #${goal.replace(/\s+/g, '')} #${topic.replace(/\s+/g, '').slice(0, 15)}`;

    const hashtags = [
      `#${category.replace(/\s+/g, '')}`,
      `#${goal.replace(/\s+/g, '')}`,
      '#PersonalBranding',
      '#ContentStrategy',
      '#CreatorEconomy',
      '#IndustryInsights',
    ];

    return {
      title,
      module: 'personal-branding',
      category,
      objective: goal,
      language,
      duration,
      hook: hooks[0],
      body,
      cta,
      methodName,
      fullContent: `[HOOK]\n${hooks[0]}\n\n[BODY]\n${body}\n\n[CALL TO ACTION]\n${cta}`,
      sections: {
        hookVariations: hooks,
        onScreenText,
        bRoll,
        caption,
        hashtags,
        tone,
        platform,
      },
      isDemoMode: true,
      providerMessage: 'Generated via ScriptFlow Intelligent Demo Engine (AI API Key not provided)',
    };
  }

  generateMetaAds(input, method) {
    const {
      campaignName = 'Meta Ads Campaign',
      brandName = 'Our Brand',
      productService = 'Growth Accelerator',
      category = 'Direct Sales',
      campaignObjective = 'Sales',
      targetAudience = 'Busy professionals and small business founders',
      customerProblem = 'Spending hours on tasks with poor ROI and zero consistency',
      benefitsUSP = 'Automate 80% of repetitive work with verified 3x efficiency',
      priceOffer = 'Special Launch Offer: 50% Off First Month',
      actualTestimonials = 'Over 1,200 clients reported saving 15 hours each week within 14 days.',
      landingPageUrl = 'https://example.com/start',
      ctaType = 'Shop Now',
      platformPlacement = 'Reels and Feed',
      language = 'English',
      duration = 45,
      tone = 'High energy, problem-solving, conversion-focused',
      additionalInstructions = '',
    } = input;

    const methodName = method?.name || 'Problem → Agitate → Solution → Offer → CTA';

    let hooks = [
      `If you're still struggling with ${customerProblem.toLowerCase()}, you're doing it the hard way.`,
      `Here is why 90% of ${targetAudience.toLowerCase()} fail at solving this—and how ${brandName} fixes it in 48 hours.`,
      `Watch this before you spend another dollar trying to solve ${customerProblem.toLowerCase()}.`,
    ];

    if (language.toLowerCase() === 'hinglish') {
      hooks = [
        `Kya aapka bhi time aur paisa ${customerProblem.toLowerCase()} mein waste ho raha hai?`,
        `Agar aap ${targetAudience.toLowerCase()} ho, toh yeh solution aapke liye pure gamechanger hai!`,
        `Wait! Dusre mehenge options try karne se pehle yeh 30 second ka video zaroor dekhein.`,
      ];
    } else if (language.toLowerCase() === 'gujarati') {
      hooks = [
        `શું તમારો કિંમતી સમય અને પૈસા પણ ${customerProblem.toLowerCase()} માં વેડફાઈ રહ્યા છે?`,
        `જો તમે ${targetAudience.toLowerCase()} છો, તો આ સોલ્યુશન તમારા માટે સંપૂર્ણ ગેમચેન્જર સાબિત થશે!`,
        `થોભો! બીજા કોઈ મોંઘા વિકલ્પો અજમાવતા પહેલા આ 30 સેકન્ડનો વીડિયો ચોક્કસ જુઓ.`,
      ];
    } else if (language.toLowerCase() === 'marathi') {
      hooks = [
        `तुमचा मौल्यवान वेळ आणि पैसा सुद्धा ${customerProblem.toLowerCase()} मध्ये वाया जात आहे का?`,
        `जर तुम्ही ${targetAudience.toLowerCase()} असाल, तर हा उपाय तुमच्यासाठी गेमचेंजर ठरेल!`,
        `थांबा! इतर महागडे पर्याय वापरण्यापूर्वी हा 30 सेकंदांचा व्हिडिओ नक्की पहा.`,
      ];
    } else if (language.toLowerCase() === 'hindi') {
      hooks = [
        `क्या आपका भी समय और पैसा ${customerProblem.toLowerCase()} में व्यर्थ हो रहा है?`,
        `यदि आप ${targetAudience.toLowerCase()} हैं, तो यह समाधान आपके लिए गेमचेंजर साबित होगा!`,
        `रुकिए! दूसरे महंगे विकल्प आजमाने से पहले यह 30 सेकंड का वीडियो ज़रूर देखें।`,
      ];
    }

    let body;
    if (language.toLowerCase() === 'hinglish') {
      body = `Main problem: Hum sab chahte hain ki results milein, par ${customerProblem.toLowerCase()} har baar roadblock ban jata hai.\n\nIntroducing ${brandName}: Aapko milta hai ${benefitsUSP}.\n\nVerified Proof: ${actualTestimonials}\n\nAbhi limited time ke liye: ${priceOffer}.`;
    } else if (language.toLowerCase() === 'gujarati') {
      body = `વાસ્તવિકતા: દરરોજ તમે ${customerProblem.toLowerCase()} નો સામનો કરો છો, તે તમારી આવક અને સમયનું મોટું નુકસાન છે.\n\n${brandName} રજૂ કરીએ છીએ: ખાસ કરીને તમને ${benefitsUSP} આપવા માટે તૈયાર કરાયેલ.\n\nગ્રાહકોનો સાચો પુરાવો: "${actualTestimonials}"\n\nખાસ ઓફર: ${priceOffer}. કોઈ છુપા ચાર્જ વગર, ગમે ત્યારે રદ કરી શકો છો.`;
    } else if (language.toLowerCase() === 'marathi') {
      body = `वस्तुस्थिती: दररोज तुम्ही ${customerProblem.toLowerCase()} चा सामना करता, त्यामुळे तुमचे महसूल आणि वेळेचे मोठे नुकसान होते.\n\nसादर करत आहोत ${brandName}: खास तुम्हाला ${benefitsUSP} देण्यासाठी तयार केलेले.\n\nग्राहकांचा खरा पुरावा: "${actualTestimonials}"\n\nविशेष ऑफर: ${priceOffer}. कोणतीही लपलेली फी नाही, कधीही रद्द करण्याची हमी.`;
    } else if (language.toLowerCase() === 'hindi') {
      body = `वास्तविकता: हर दिन ${customerProblem.toLowerCase()} का सामना करना आपके समय और राजस्व का भारी नुकसान है।\n\nप्रस्तुत है ${brandName}: खास तौर पर आपको ${benefitsUSP} प्रदान करने के लिए तैयार किया गया।\n\nसत्यापित प्रमाण: "${actualTestimonials}"\n\nविशेष ऑफर: ${priceOffer}। बिना किसी छिपे शुल्क के, कभी भी रद्द करने की गारंटी।`;
    } else {
      body = `The Reality: Every day you deal with ${customerProblem.toLowerCase()} is revenue and energy left on the table.\n\nMeet ${brandName}: Built specifically to give you ${benefitsUSP}.\n\nReal Customer Evidence: "${actualTestimonials}"\n\nExclusive Offer: ${priceOffer}. No hidden catches, cancel anytime guarantee.`;
    }

    const cta = language.toLowerCase() === 'gujarati'
      ? `તમારી સ્પેશિયલ ઓફર મેળવવા અને તરત જ શરૂ કરવા માટે નીચે આપેલા બટન પર ક્લિક કરો: ${landingPageUrl}!`
      : language.toLowerCase() === 'marathi'
      ? `तुमची विशेष ऑफर मिळवण्यासाठी आणि लगेच सुरुवात करण्यासाठी खालील बटणावर क्लिक करा: ${landingPageUrl}!`
      : language.toLowerCase() === 'hindi'
      ? `अपना विशेष ऑफर पाने और तुरंत शुरुआत करने के लिए नीचे दिए गए बटन पर क्लिक करें: ${landingPageUrl}!`
      : language.toLowerCase() === 'hinglish'
      ? `Apna exclusive offer claim karne aur turant shuru karne ke liye niche click karein: ${landingPageUrl}!`
      : `Click the button below to claim your offer and get started immediately at ${landingPageUrl}!`;

    const sceneVisuals = [
      {
        scene: 'Scene 1 (0-3s)',
        visual: 'Fast-paced hook: User looking frustrated with current messy manual process or struggle.',
        audio: hooks[0],
        onScreenText: 'Tired of this problem?',
      },
      {
        scene: 'Scene 2 (4-15s)',
        visual: `Clean transition showing ${brandName} in action with smooth UI / product highlight.`,
        audio: `Here is the faster way: ${benefitsUSP}.`,
        onScreenText: benefitsUSP,
      },
      {
        scene: 'Scene 3 (16-30s)',
        visual: 'Split screen showing customer results, authentic testimonial badge, or before/after.',
        audio: actualTestimonials,
        onScreenText: 'Proven Results • Trusted by Experts',
      },
      {
        scene: 'Scene 4 (31-45s)',
        visual: `Clear dynamic graphic of the offer: "${priceOffer}" with arrow pointing down to CTA.`,
        audio: cta,
        onScreenText: `${priceOffer} • Click Below!`,
      },
    ];

    const primaryAdCopy = `Are you tired of ${customerProblem.toLowerCase()}?\n\n${brandName} gives you ${benefitsUSP}.\n\n✅ Verified results: ${actualTestimonials}\n🔥 ${priceOffer}\n\n👉 Click below to claim your exclusive discount before spots fill up!`;

    const headline = `${brandName} — ${benefitsUSP.slice(0, 48)}`;
    const description = `${priceOffer} • Verified Fast Results`;

    return {
      title: campaignName,
      module: 'meta-ads',
      category,
      objective: campaignObjective,
      language,
      duration,
      hook: hooks[0],
      body,
      cta,
      methodName,
      fullContent: `[HOOK]\n${hooks[0]}\n\n[BODY]\n${body}\n\n[CALL TO ACTION]\n${cta}\n\n[AD COPY]\n${primaryAdCopy}\n\n[HEADLINE]: ${headline}`,
      sections: {
        hookVariations: hooks,
        sceneVisuals,
        onScreenText: sceneVisuals.map((s) => `${s.scene}: ${s.onScreenText}`),
        voiceover: sceneVisuals.map((s) => s.audio).join(' '),
        primaryAdCopy,
        headline,
        description,
        ctaButtonRecommendation: ctaType,
        scriptVariation: `Alternative Angle: "What if you could eliminate ${customerProblem.toLowerCase()} starting today?" Focus on direct cost-savings and rapid onboarding.`,
        brandName,
        productService,
      },
      isDemoMode: true,
      providerMessage: 'Generated via ScriptFlow Intelligent Demo Engine (AI API Key not provided)',
    };
  }

  generateStoryMarketing(input, method) {
    const {
      title = 'Story Marketing Campaign',
      category = 'Story Default',
      topic = 'Behind the scenes journey & special announcement',
      slideCount = 5,
      ctaType = 'Send DM',
      targetAudience = 'Engaged community & potential customers',
      language = 'English',
      tone = 'Conversational, intimate, candid',
      additionalInstructions = '',
    } = input;

    const count = Math.min(Math.max(parseInt(slideCount, 10) || 5, 3), 7);
    const slides = [];

    const langLower = language.toLowerCase();

    // Slide 1: Attention-grabbing opening
    slides.push({
      slideNumber: 1,
      type: 'Opening Hook',
      text: langLower === 'gujarati'
        ? `હું છેલ્લા 3 અઠવાડિયાથી એક ગુપ્ત પ્રોજેક્ટ પર કામ કરી રહ્યો હતો... અને આખરે આજે તમારી સાથે શેર કરી રહ્યો છું! 👀`
        : langLower === 'marathi'
        ? `मी गेल्या ३ आठवड्यांपासून एका गुप्त प्रोजेक्टवर काम करत होतो... आणि आज अखेर तुमच्यासोबत शेअर करत आहे! 👀`
        : langLower === 'hindi'
        ? `मैं पिछले 3 हफ़्तों से एक सीक्रेट प्रोजेक्ट पर काम कर रहा था... और आखिरकार आज आपके साथ शेयर कर रहा हूँ! 👀`
        : langLower === 'hinglish'
        ? `Main pichle 3 hafton se ek secret project pe kaam kar raha tha... and finally I can share this with you! 👀`
        : `I almost didn't post this, but something happened behind the scenes that changed everything... 👀`,
      visualSuggestion: 'Selfie video or candid unedited photo looking straight at camera with curiosity sticker.',
      stickerSuggestion: 'Poll Sticker: "Did you guess it?" (Yes / Tell me!)',
      ctaText: 'Tap to see next',
    });

    // Slide 2: Problem or Context
    slides.push({
      slideNumber: 2,
      type: 'Problem & Context',
      text: langLower === 'gujarati'
        ? `સૌથી મોટો મુદ્દો એ હતો: આપણે માનીએ છીએ કે સફળતા રાતોરાત આવે છે, પરંતુ વાસ્તવિક સંઘર્ષ અદ્રશ્ય હોય છે.`
        : langLower === 'marathi'
        ? `सर्वात मोठी अडचण ही होती: यश एका रात्रीत मिळते असा समज असतो, पण खरा संघर्ष अदृश्य असतो.`
        : langLower === 'hindi'
        ? `सबसे बड़ी चुनौती यह थी: हमें लगता है कि सफलता रातों-रात मिलती है, लेकिन असली संघर्ष दिखाई नहीं देता।`
        : langLower === 'hinglish'
        ? `Sabse bada issue yeh tha: humein lagta hai ki success overnight aati hai, par real struggle invisible hota hai.`
        : `Here was the real challenge: when we started, we were hitting a wall every single week trying to get consistent results.`,
      visualSuggestion: 'Desk shot or workspace photo with text overlay box in high-contrast neutral tone.',
      stickerSuggestion: 'Emoji Slider with fire or thinking face 🔥',
      ctaText: '',
    });

    // Slide 3: Insight / Relatable Moment
    if (count >= 3) {
      slides.push({
        slideNumber: 3,
        type: 'The Relatable Insight',
        text: langLower === 'gujarati'
          ? `પછી મને સમજાયું: શોર્ટકટ પાછળ દોડવાથી કંઈ નહીં થાય. સિસ્ટમ અને શિસ્ત જ સાચો તફાવત લાવે છે.`
          : langLower === 'marathi'
          ? `मग मला समजले: शॉर्टकट मागे धावून काही साध्य होत नाही. शिस्त आणि योग्य पद्धतच खरा बदल घडवते.`
          : langLower === 'hindi'
          ? `फिर समझ आया: शॉर्टकट के पीछे भागने से कुछ नहीं होगा। सही सिस्टम और अनुशासन ही असली फर्क लाते हैं।`
          : langLower === 'hinglish'
          ? `Phir humne realize kiya: shortcuts ke peeche bhaagne se kuch nahi hoga. System aur discipline hi real difference banate hain.`
          : `That is when we made one simple shift in our approach, and the entire roadblock disappeared.`,
        visualSuggestion: 'Short 5-sec talking head video or aesthetic photo with highlight circles on key takeaway.',
        stickerSuggestion: 'Question Box: "Have you experienced this too?"',
        ctaText: '',
      });
    }

    // Slide 4: Solution / Takeaway (if 4 or more)
    if (count >= 4) {
      slides.push({
        slideNumber: 4,
        type: 'The Solution & Value',
        text: langLower === 'gujarati'
          ? `અમે એક સંપૂર્ણ બ્લુપ્રિન્ટ તૈયાર કરી છે જેથી કોઈપણ તેને સરળતાથી સ્ટેપ-બાય-સ્ટેપ લાગુ કરી શકે.`
          : langLower === 'marathi'
          ? `आम्ही एक संपूर्ण ब्लूप्रिंट तयार केली आहे जेणेकरून कोणीही ती सहजपणे पायरी-पायरीने वापरू शकेल.`
          : langLower === 'hindi'
          ? `हमने एक पूरी ब्लूप्रिंट तैयार की है ताकि कोई भी इसे आसानी से स्टेप-बाय-स्टेप लागू कर सके।`
          : langLower === 'hinglish'
          ? `Humne ek complete blueprint create kiya hai jisse koi bhi isse easily implement kar sakta hai step-by-step.`
          : `We packaged the exact framework so you can avoid our 6 months of mistakes in just 10 minutes.`,
        visualSuggestion: 'Screenshot preview of framework, document, or happy client snapshot with subtle blur on confidential parts.',
        stickerSuggestion: 'Countdown Sticker or "Tap here" sticker',
        ctaText: '',
      });
    }

    // Intermediate slides if 6 or 7
    if (count >= 6) {
      slides.push({
        slideNumber: 5,
        type: 'Social Proof / Urgency',
        text: langLower === 'gujarati'
          ? `પ્રથમ 50 લોકો જેમણે આ અજમાવ્યું તેમને 72 કલાકમાં અસાધારણ પરિણામ મળ્યા. જગ્યાઓ મર્યાદિત છે.`
          : langLower === 'marathi'
          ? `ज्या पहिल्या ५० जणांनी ही पद्धत वापरली, त्यांना ७२ तासांत उत्तम निकाल मिळाले. जागा मर्यादित आहेत.`
          : langLower === 'hindi'
          ? `पहले 50 लोग जिन्होंने इसे आजमाया, उन्हें 72 घंटों में शानदार परिणाम मिले। सीटें सीमित हैं।`
          : langLower === 'hinglish'
          ? `Pehle 50 logon ne jab yeh test kiya toh unhe 72 hours mein amazing breakthroughs mile. Spots strictly limited hain.`
          : `The first 50 people who tested this got remarkable breakthroughs within 72 hours. Spots are strictly limited.`,
        visualSuggestion: 'Quick carousel preview or WhatsApp/DM screenshot praise.',
        stickerSuggestion: 'Reaction Sticker 🔥',
        ctaText: '',
      });
    }

    // Final Slide: CTA
    const finalSlideNum = slides.length + 1;
    slides.push({
      slideNumber: finalSlideNum,
      type: 'Direct CTA',
      text: langLower === 'gujarati'
        ? `જો તમને આ બ્લુપ્રિન્ટ જોઈતી હોય, તો નીચે "GROWTH" શબ્દ સાથે ${ctaType} કરો અને હું વ્યક્તિગત રીતે મોકલીશ! 👇`
        : langLower === 'marathi'
        ? `जर तुम्हाला ही ब्लूप्रिंट हवी असेल, तर खाली "GROWTH" टाईप करून ${ctaType} करा, मी स्वतः पाठवीन! 👇`
        : langLower === 'hindi'
        ? `यदि आपको यह ब्लूप्रिंट चाहिए, तो नीचे "GROWTH" लिखकर ${ctaType} करें और मैं व्यक्तिगत रूप से भेजूंगा! 👇`
        : langLower === 'hinglish'
        ? `Agar aapko yeh blueprint chahiye, toh niche ${ctaType} karo with the word "GROWTH" aur main personally send karunga! 👇`
        : `Want the complete step-by-step guide? ${ctaType} with the word "READY" and I'll send it directly to your inbox right now! 👇`,
      visualSuggestion: 'Warm smiling photo or pointing downward toward the message bar.',
      stickerSuggestion: `${ctaType} Link / Sticker / DM Prompt`,
      ctaText: `${ctaType}: Send "READY"`,
    });

    const hook = slides[0].text;
    const body = slides.slice(1, -1).map((s) => `[Slide ${s.slideNumber}: ${s.type}]\n${s.text}`).join('\n\n');
    const cta = slides[slides.length - 1].text;

    return {
      title,
      module: 'story-marketing',
      category,
      objective: ctaType,
      language,
      duration: count * 10,
      hook,
      body,
      cta,
      methodName: 'Attention → Problem → Insight → Solution → CTA',
      fullContent: slides.map((s) => `=== SLIDE ${s.slideNumber} (${s.type}) ===\nText: ${s.text}\nVisual: ${s.visualSuggestion}\nSticker: ${s.stickerSuggestion}\nCTA: ${s.ctaText || 'None'}`).join('\n\n'),
      sections: {
        slides,
        slideCount: slides.length,
        ctaType,
        copyAllText: slides.map((s) => `Slide ${s.slideNumber}:\n${s.text}`).join('\n\n'),
      },
      isDemoMode: true,
      providerMessage: 'Generated via ScriptFlow Intelligent Demo Engine (AI API Key not provided)',
    };
  }

  generateUniversal(input, method) {
    const {
      title = 'Custom Generated Script',
      module = 'universal',
      category = 'Informative',
      objective = 'Engagement',
      language = 'English',
      duration = 60,
      inputData = {},
    } = input;

    const topic = inputData.topic || inputData.title || title;
    const audience = inputData.targetAudience || 'General Audience';
    const methodName = method?.name || 'Hook → Problem → Explanation → Solution → CTA';
    const steps = method?.steps || [
      { order: 1, name: 'Hook', description: 'Capture attention instantly' },
      { order: 2, name: 'Problem', description: 'Highlight audience struggle' },
      { order: 3, name: 'Explanation', description: 'Break down why it happens' },
      { order: 4, name: 'Solution', description: 'Provide the actionable answer' },
      { order: 5, name: 'CTA', description: 'Direct next step' },
    ];

    const hook = `If you care about ${topic.toLowerCase()}, you need to hear this right now.`;
    const stepOutputs = steps.map((s) => {
      return `[Step: ${s.name}]\nIn the context of ${topic.toLowerCase()}, ${s.description.toLowerCase() || 'focusing on maximum clarity and audience retention'}. This gives ${audience.toLowerCase()} immediate value without fluff.`;
    });

    const body = stepOutputs.slice(1, -1).join('\n\n');
    const cta = `If you found this valuable, share it with someone who needs it, and follow for more actionable insights!`;

    return {
      title,
      module,
      category,
      objective,
      language,
      duration,
      hook,
      body,
      cta,
      methodName,
      fullContent: `[METHOD: ${methodName}]\n\n[HOOK]\n${hook}\n\n[BODY]\n${body}\n\n[CTA]\n${cta}`,
      sections: {
        methodSteps: steps,
        generatedSteps: stepOutputs,
      },
      isDemoMode: true,
      providerMessage: 'Generated via ScriptFlow Intelligent Demo Engine (AI API Key not provided)',
    };
  }

  regenerateSection(module, section, currentScript = {}, inputData = {}) {
    const topic = inputData.topic || inputData.productService || 'this topic';
    const category = inputData.category || 'Professional';
    const cleanLanguage = normalizeLanguage(inputData.language || 'English');
    const langLower = cleanLanguage.toLowerCase();

    if (section === 'hook') {
      const hooks = langLower === 'gujarati'
        ? [
            `થોભો! શું તમે પણ ${topic.toLowerCase()} માં આ સૌથી સામાન્ય ભૂલ વારંવાર કરી રહ્યા છો?`,
            `સાચું કહું? 90% લોકો ${topic.toLowerCase()} ને ખોટી રીતે અપ્રોચ કરે છે.`,
            `આ 1 સિક્રેટ ટેકનિક જાણી લો જો તમારે ${topic.toLowerCase()} માં અલગ ઓળખ બનાવવી હોય.`,
          ]
        : langLower === 'marathi'
        ? [
            `थांबा! तुम्ही सुद्धा ${topic.toLowerCase()} मध्ये ही सर्वात मोठी चूक पुन्हा पुन्हा करत आहात का?`,
            `खरं सांगू? 90% लोक ${topic.toLowerCase()} कडे चुकीच्या दृष्टिकोनातून पाहतात.`,
            `ही 1 गुप्त पद्धत जाणून घ्या जर तुम्हाला ${topic.toLowerCase()} मध्ये ओळख निर्माण करायची असेल.`,
          ]
        : langLower === 'hindi'
        ? [
            `रुकिए! क्या आप भी ${topic.toLowerCase()} को लेकर यह सबसे आम गलती बार-बार कर रहे हैं?`,
            `सच बताऊं? 90% लोग ${topic.toLowerCase()} को पूरी तरह गलत तरीके से अप्रोच करते हैं।`,
            `यह 1 सीक्रेट फॉर्मूला जान लीजिए अगर आपको ${topic.toLowerCase()} में आगे निकलना है।`,
          ]
        : langLower === 'hinglish'
        ? [
            `Ruko! Kya aap bhi ${topic.toLowerCase()} mein yeh sabse common galti repeat kar rahe ho?`,
            `Sach bataun? 90% log ${topic.toLowerCase()} ko completely galat approach karte hain.`,
            `Yeh 1 secret technique jaan lo agar aapko ${topic.toLowerCase()} mein standout karna hai.`,
          ]
        : [
            `Wait, before you scroll—this one insight about ${topic.toLowerCase()} will save you hours of trial and error.`,
            `The single biggest mistake people make with ${topic.toLowerCase()} is ignoring this foundational rule.`,
            `Here is what nobody tells you about mastering ${topic.toLowerCase()} in 2026.`,
          ];
      const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];
      return {
        hook: selectedHook,
        hookVariations: hooks,
        message: 'Hook regenerated successfully while preserving your body and CTA.',
      };
    }

    if (section === 'body') {
      const newBody = langLower === 'gujarati'
        ? `મુદ્દો 1: પહેલા મૂળ કારણ સમજો. જ્યાં સુધી તમારો પાયો મજબૂત નહીં હોય, ત્યાં સુધી પરિણામો કામચલાઉ રહેશે.\n\nમુદ્દો 2: વ્યવહારુ અમલ શરૂ કરો. દૈનિક સાતત્ય અને ફીડબેક લૂપ જાળવી રાખો.\n\nમુદ્દો 3: પરિણામો માપો. ડેટાનું વિશ્લેષણ કરો અને સતત સુધારો કરતા રહો.`
        : langLower === 'marathi'
        ? `मुद्दा 1: आधी मूळ अडचण समजून घ्या. जोपर्यंत तुमचा पाया मजबूत नाही, तोपर्यंत निकाल तात्पुरते राहतील.\n\nमुद्दा 2: प्रत्यक्ष कृती सुरू करा. दैनंदिन सातत्य आणि योग्य अभिप्राय ठेवा.\n\nमुद्दा 3: निकाल तपासा. सातत्याने आवश्यक सुधारणा करा.`
        : langLower === 'hindi'
        ? `बिंदु 1: सबसे पहले मूल समस्या को समझें। जब तक आधार मजबूत नहीं होगा, परिणाम अस्थायी रहेंगे।\n\nबिंदु 2: व्यावहारिक अमल शुरू करें। दैनिक निरंतरता और फीडबैक बनाए रखें।\n\nबिंदु 3: परिणामों का विश्लेषण करें और लगातार सुधार करते रहें।`
        : langLower === 'hinglish'
        ? `Point 1: Sabse pehle root cause samjho. Jab tak aapka foundation strong nahi hoga, results temporary rahenge.\n\nPoint 2: Practical implementation shuru karo. Daily consistency aur feedback loop maintain karo.\n\nPoint 3: Measure results. Data dekho aur continuous optimize karte raho.`
        : `Phase 1: Diagnosis. Identify where the biggest friction lies in ${topic.toLowerCase()}.\n\nPhase 2: Targeted execution. Focus on the 20% of effort that produces 80% of tangible momentum.\n\nPhase 3: Compounding. Solidify the process so your audience experiences undeniable value every single time.`;
      return {
        body: newBody,
        message: 'Body section regenerated successfully while preserving your hook and CTA.',
      };
    }

    if (section === 'cta') {
      const newCta = langLower === 'gujarati'
        ? `જો આ માહિતી ઉપયોગી લાગી હોય તો હમણાં જ સેવ કરો અને દરરોજ નવી ટિપ્સ માટે ફોલો બટન દબાવો!`
        : langLower === 'marathi'
        ? `ही माहिती उपयुक्त वाटल्यास आत्ताच सेव्ह करा आणि दररोज नवीन टिप्ससाठी फॉलो करा!`
        : langLower === 'hindi'
        ? `यदि यह जानकारी उपयोगी लगी तो अभी सेव करें और रोज़ाना नई रणनीतियों के लिए फॉलो करें!`
        : langLower === 'hinglish'
        ? `Agar yeh helpful laga toh abhi save karein aur follow button press karein for more valuable tips!`
        : `Save this post for later, drop your biggest question in the comments below, and tap follow for daily updates!`;
      return {
        cta: newCta,
        message: 'CTA regenerated successfully while preserving your hook and body.',
      };
    }

    return {
      message: 'Regeneration complete',
    };
  }
}

const intelligentDemoEngine = new IntelligentDemoEngine();

/**
 * Server-Side AI Service
 * Communicates with external LLM if configured; gracefully falls back to Intelligent Demo Engine
 */
export const aiService = {
  async generateScript({ module, category, objective, language, duration, inputData, method }) {
    const cleanLanguage = normalizeLanguage(language);

    // Safe diagnostic log without exposing API keys or credentials
    console.log(`[AIService] generateScript invoked | Module: ${module} | Language: ${cleanLanguage}`);

    // Check if real Gemini API key is configured (via env or DB credentials)
    const geminiKey = await geminiProvider.getApiKey();
    if (geminiKey) {
      try {
        const liveResult = await geminiProvider.generateScript({
          module,
          category,
          objective,
          language: cleanLanguage,
          duration,
          inputData,
          method,
        });
        if (liveResult) {
          return {
            ...liveResult,
            language: cleanLanguage,
            isDemoMode: false,
            providerMessage: `Generated via live Google Gemini (${env.AI_MODEL || 'gemini-1.5-flash'})`,
          };
        }
      } catch (err) {
        console.warn('[AI Service] Live Gemini call failed or timed out:', err.message);
        console.warn('[AI Service] Falling back smoothly to Intelligent Demo Engine');
      }
    }

    // Demo Mode Fallback
    switch (module) {
      case 'personal-branding':
        return intelligentDemoEngine.generatePersonalBranding({ category, goal: objective, language: cleanLanguage, duration, ...inputData }, method);
      case 'meta-ads':
        return intelligentDemoEngine.generateMetaAds({ category, campaignObjective: objective, language: cleanLanguage, duration, ...inputData }, method);
      case 'story-marketing':
        return intelligentDemoEngine.generateStoryMarketing({ category, ctaType: objective, language: cleanLanguage, ...inputData }, method);
      case 'universal':
      default:
        return intelligentDemoEngine.generateUniversal({ module, category, objective, language: cleanLanguage, duration, inputData }, method);
    }
  },

  async regenerateSection({ module, section, currentScript, inputData }) {
    if (section === 'all') {
      return this.generateScript({
        module,
        category: inputData.category || 'General',
        objective: inputData.objective || 'Engagement',
        language: inputData.language || 'English',
        duration: inputData.duration || 60,
        inputData,
      });
    }

    return intelligentDemoEngine.regenerateSection(module, section, currentScript, inputData);
  },

  async callExternalAIProvider({ module, category, objective, language, duration, inputData, method }) {
    const cleanLanguage = normalizeLanguage(language);
    const languageInstruction = getLanguagePromptInstruction(cleanLanguage);

    // Primary: Google Gen AI official client
    try {
      const result = await geminiProvider.generateScript({ module, category, objective, language: cleanLanguage, duration, inputData, method });
      if (result) return result;
    } catch (err) {
      console.warn('[AI Service] geminiProvider.generateScript error:', err.message);
    }

    // Secondary fallback: Direct Google Gemini REST API
    const key = await geminiProvider.getApiKey();
    if (!key) throw new Error('No Gemini API key available');

    const prompt = `You are a world-class marketing scriptwriter and viral content strategist.
Module: ${module}
Category: ${category}
Objective: ${objective}
${languageInstruction}
Duration: ${duration} seconds
Method: ${method?.name || 'Default framework'}
Details: ${JSON.stringify(inputData)}

Respond strictly in valid JSON format with the following keys:
{
  "title": "Script Title",
  "hook": "Primary hook",
  "body": "Main body script",
  "cta": "Call to action",
  "fullContent": "Full script compiled",
  "sections": {
    "hookVariations": ["Hook 1", "Hook 2", "Hook 3"],
    "onScreenText": ["Timestamps and text overlays"],
    "bRoll": ["Visual cues"],
    "caption": "Social media caption",
    "hashtags": ["#tags"]
  }
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${env.AI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${key}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`AI Provider responded with status: ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No candidate content received from AI');
    }

    const parsed = JSON.parse(candidateText);
    return {
      title: parsed.title || inputData.title || `${category} Script`,
      module,
      category,
      objective,
      language,
      duration,
      hook: parsed.hook || '',
      body: parsed.body || '',
      cta: parsed.cta || '',
      fullContent: parsed.fullContent || `${parsed.hook}\n\n${parsed.body}\n\n${parsed.cta}`,
      sections: parsed.sections || {},
    };
  },
};
