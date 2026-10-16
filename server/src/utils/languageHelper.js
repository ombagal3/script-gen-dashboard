/**
 * Language Helper Utility for Script Generation Dashboard
 * Enforces strict, unambiguous language instructions across all AI providers,
 * template generators, fallback engines, and reference analyses.
 */

export const SUPPORTED_LANGUAGES = ['English', 'Hinglish', 'Hindi', 'Marathi', 'Gujarati'];

/**
 * Normalizes input language string into standard title-case supported language
 */
export function normalizeLanguage(lang) {
  if (!lang || typeof lang !== 'string') return 'English';
  const clean = lang.trim().toLowerCase();
  if (clean === 'hinglish') return 'Hinglish';
  if (clean === 'hindi') return 'Hindi';
  if (clean === 'marathi') return 'Marathi';
  if (clean === 'gujarati') return 'Gujarati';
  if (clean === 'english') return 'English';
  // Check prefix / partial match
  const matched = SUPPORTED_LANGUAGES.find((l) => l.toLowerCase() === clean);
  return matched || 'English';
}

/**
 * Generates an iron-clad instruction block for LLMs (Google Gemini)
 * that explicitly forbids language drift or silent fallback to Hindi.
 */
export function getLanguagePromptInstruction(lang) {
  const language = normalizeLanguage(lang);

  const baseNegativeConstraint = `MANDATORY NEGATIVE CONSTRAINTS:
- Do not generate Hindi when a language other than Hindi is selected.
- Generate all user-facing script text (hooks, hook variations, spoken body dialogue, CTA, captions, and hashtags) strictly in ${language}.
- Do not silently fall back to Hindi or Hinglish.
- Keep technical terms, brand names, product names, and proper nouns intact without awkward translation.`;

  switch (language) {
    case 'Gujarati':
      return `PRIMARY LANGUAGE: Gujarati (ગુજરાતી)
EXPLICIT LANGUAGE RULES:
- The user selected Gujarati. You MUST generate all spoken script lines, hook, all 3 hook variations, body dialogue, CTA, scene spoken lines, and captions in natural, fluent Gujarati written in authentic Gujarati script (ગુજરાતી).
- Use natural creator phrasing and conversational cadence spoken by top creators in Gujarat.
${baseNegativeConstraint}`;

    case 'Marathi':
      return `PRIMARY LANGUAGE: Marathi (मराठी)
EXPLICIT LANGUAGE RULES:
- The user selected Marathi. You MUST generate all spoken script lines, hook, all 3 hook variations, body dialogue, CTA, scene spoken lines, and captions in authentic, fluent Marathi (मराठी) written in Devanagari script.
- Use natural conversational Marathi as spoken by modern Maharashtra creators.
- Do NOT output Hindi words or sentences. Even though Marathi uses Devanagari script, the grammar and vocabulary MUST be strictly Marathi (e.g. वापरा 'करा', 'सांगतो', 'बघा', not Hindi 'करो', 'बताता हूं', 'देखो').
${baseNegativeConstraint}`;

    case 'Hindi':
      return `PRIMARY LANGUAGE: Hindi (हिंदी)
EXPLICIT LANGUAGE RULES:
- The user selected Hindi. You MUST generate all spoken script lines, hook, hook variations, body dialogue, CTA, and captions in conversational, punchy Hindi written in Devanagari script (हिंदी).
- Avoid overly archaic, Sanskritized words. Use natural spoken Hindi that creators use on Instagram Reels and YouTube Shorts.
- Generate all user-facing script text in fluent Hindi.`;

    case 'Hinglish':
      return `PRIMARY LANGUAGE: Hinglish (Hindi-English mix in Roman script)
EXPLICIT LANGUAGE RULES:
- The user selected Hinglish. You MUST generate all spoken script lines, hooks, body dialogue, CTA, and captions in natural conversational Hinglish written STRICTLY in the English/Roman alphabet (e.g., 'Agar aap bhi yeh 1 mistake kar rahe ho, toh stop scrolling right now...').
- DO NOT write in Devanagari script.
- Do NOT generate pure English or pure Devanagari Hindi. Produce a punchy, creator-style Hindi-English blend.
${baseNegativeConstraint}`;

    case 'English':
    default:
      return `PRIMARY LANGUAGE: English
EXPLICIT LANGUAGE RULES:
- The user selected English. You MUST generate all spoken script lines, hooks, all 3 hook variations, body dialogue, CTA, captions, and hashtags EXCLUSIVELY in natural, punchy, spoken English.
- DO NOT use Hindi or Hinglish words (e.g., do NOT use 'aap', 'karo', 'bhi', 'arre').
${baseNegativeConstraint}`;
  }
}

/**
 * Returns reference video hook patterns in the requested language
 * to prevent injecting Hindi few-shot examples into non-Hindi prompts.
 */
export function getLanguageReferenceHooks(lang, topic = 'this', industry = 'this industry') {
  const language = normalizeLanguage(lang);

  switch (language) {
    case 'Gujarati':
      return [
        `"જો તમે પણ ${topic} માં આ 1 ભૂલ કરી રહ્યા છો, તો હમણાં જ થોભો..."`,
        `"કોઈ તમને આ નથી કહેતું, પણ 90% લોકો ${topic} માં અહીં જ મોટું નુકસાન કરે છે..."`,
        `"3 મહત્વની બાબતો જે મને ${topic} શરૂ કરતા પહેલા ખબર હોવી જોઈતી હતી..."`,
      ];
    case 'Marathi':
      return [
        `"जर तुम्ही सुद्धा ${topic} मध्ये ही 1 चूक करत असाल, तर आत्ताच थांबा..."`,
        `"कोणीही तुम्हाला हे सांगत नाही, पण 90% लोक ${topic} मध्ये इथेच फसतात..."`,
        `"3 महत्त्वाच्या गोष्टी ज्या मला ${topic} सुरू करण्यापूर्वी माहीत असायला हव्या होत्या..."`,
      ];
    case 'Hindi':
      return [
        `"अगर आप भी ${topic} में यह 1 गलती कर रहे हैं, तो तुरंत रुकिए..."`,
        `"कोई आपको यह नहीं बता रहा, पर 90% लोग ${topic} में यहाँ भारी नुकसान उठाते हैं..."`,
        `"3 ज़रूरी बातें जो मुझे ${topic} शुरू करने से पहले पता होनी चाहिए थीं..."`,
      ];
    case 'Hinglish':
      return [
        `"Agar aap bhi ${topic} mein yeh 1 mistake kar rahe ho, toh stop scrolling right now..."`,
        `"Nobody is telling you this, but here is the exact reason why 90% of people overpay in ${industry}..."`,
        `"3 things I wish I knew before starting ${topic}..."`,
      ];
    case 'English':
    default:
      return [
        `"If you're still making this 1 mistake with ${topic}, stop scrolling right now..."`,
        `"Nobody in ${industry} is telling you this, but here is why 90% of people overpay..."`,
        `"3 things I wish I knew before tackling ${topic}..."`,
      ];
  }
}

/**
 * Returns content gap patterns adapted to language
 */
export function getLanguageContentGaps(lang) {
  const language = normalizeLanguage(lang);

  switch (language) {
    case 'Gujarati':
      return [
        `મોટાભાગના સ્પર્ધકો માત્ર સમસ્યા રજૂ કરે છે પરંતુ સ્ટેપ-બાય-સ્ટેપ સ્પષ્ટ ગણતરી કે ઉકેલ નથી આપતા.`,
        `ગુજરાતી ભાષામાં સરળ, વ્યવહારુ અને ઓથેન્ટિક કન્ટેન્ટનો મોટો અભાવ છે.`,
        `સામાન્ય સલાહો વધુ છે; વાસ્તવિક કેસ સ્ટડીઝ અને વ્યવહારુ ચેકલિસ્ટ કોઈ આપતું નથી.`,
      ];
    case 'Marathi':
      return [
        `बहुतेक स्पर्धक फक्त समस्या मांडतात, पण स्टेप-बाय-स्टेप उपाय किंवा अचूक कॅल्क्युलेशन दाखवत नाहीत.`,
        `मराठीमध्ये सोप्या, संवादात्मक आणि थेट व्यावहारिक मार्गदर्शनाचा मोठा अभाव आहे.`,
        `सर्वसाधारण माहिती जास्त दिली जाते; प्रत्यक्ष अनुभव आणि चेकलिस्ट कोणीही शेअर करत नाही.`,
      ];
    case 'Hindi':
      return [
        `अधिकांश प्रतिस्पर्धी केवल समस्या गिनाते हैं, बिना कोई स्पष्ट स्टेप-बाय-स्टेप समाधान दिए।`,
        `सरल बोलचाल की हिंदी में सटीक और बिना किसी भटकाव वाली जानकारी की कमी है।`,
        `केवल सामान्य ज्ञान दिया जाता है; वास्तविक केस स्टडीज और व्यावहारिक चेकलिस्ट बहुत कम हैं।`,
      ];
    case 'Hinglish':
      return [
        `Most competitor videos only state the problem without showing the exact calculation or step-by-step resolution.`,
        `Lack of clear conversational Hinglish explanations that translate official jargon into simple spoken words.`,
        `Generic advice dominates; very few creators share exact case studies or practical checklists viewers can screenshot.`,
      ];
    case 'English':
    default:
      return [
        `Most competitor videos only state the high-level problem without showing the exact calculation or actionable framework.`,
        `Heavy reliance on dry corporate jargon instead of clear, engaging spoken English breakdowns.`,
        `Generic advice dominates; very few creators share concrete case studies or actionable cheat sheets.`,
      ];
  }
}
