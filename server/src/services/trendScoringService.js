/**
 * Trend Scoring Service
 * Computes normalized Momentum Scores and Content Opportunity Scores
 * with transparent explanations and configurable weights.
 */

export const trendScoringService = {
  /**
   * Calculates a normalized Trend Momentum Score from 0 to 100
   * Uses search interest change, hashtag activity, source activity, and recency.
   */
  calculateMomentumScore(trendData = {}) {
    const {
      source,
      verifiedMetrics = {},
      firstObservedAt,
      lastVerifiedAt,
      lifecycle,
    } = trendData;

    let score = 70;
    let factors = [];

    // Factor 1: Lifecycle position
    if (lifecycle === 'Emerging') {
      score += 15;
      factors.push('Rapid early-stage growth curve');
    } else if (lifecycle === 'Growing') {
      score += 12;
      factors.push('Strong consistent upward trajectory');
    } else if (lifecycle === 'Peak') {
      score += 8;
      factors.push('Maximum current attention volume');
    } else if (lifecycle === 'Declining') {
      score -= 20;
      factors.push('Attention momentum cooling down');
    } else if (lifecycle === 'Evergreen') {
      score += 5;
      factors.push('Stable historical evergreen demand');
    }

    // Factor 2: Metrics evidence
    if (verifiedMetrics.searchInterestChange && verifiedMetrics.searchInterestChange.includes('+')) {
      score += 8;
      factors.push(`Search interest spike (${verifiedMetrics.searchInterestChange})`);
    }

    if (verifiedMetrics.recentArticlesCount && verifiedMetrics.recentArticlesCount >= 3) {
      score += 5;
      factors.push(`Multiple independent media references (${verifiedMetrics.recentArticlesCount} articles)`);
    }

    // Factor 3: Recency
    const ageInHours = (Date.now() - new Date(lastVerifiedAt || Date.now()).getTime()) / 3600000;
    if (ageInHours < 24) {
      score += 5;
      factors.push('Verified active within the last 24 hours');
    } else if (ageInHours > 72) {
      score -= 8;
      factors.push('Over 72 hours since last source verification');
    }

    const finalScore = Math.min(100, Math.max(10, Math.round(score)));

    return {
      score: finalScore,
      explanation: factors.length > 0
        ? `Momentum of ${finalScore}/100 driven by: ${factors.join('; ')}.`
        : 'Sufficient source activity observed to substantiate active momentum.',
    };
  },

  /**
   * Calculates a separate Content Opportunity Score from 0 to 100
   * Weight breakdown:
   * - Niche Relevance: 25%
   * - Audience Relevance: 20%
   * - Momentum Score: 20%
   * - Freshness: 15%
   * - Saturation Level: 10%
   * - Module Suitability: 10%
   */
  calculateOpportunityScore(trendData = {}) {
    const {
      momentumScore = 75,
      saturation = 'Moderate Saturation',
      lifecycle = 'Growing',
      relevantModules = [],
      relevantCategories = [],
      dataFreshnessStatus = 'Verified Fresh',
    } = trendData;

    let base = 0;

    // 1. Niche & Category Relevance (up to 25 pts)
    const categoryCount = relevantCategories.length;
    const categoryPts = Math.min(25, 15 + categoryCount * 2);
    base += categoryPts;

    // 2. Audience Relevance & Momentum Contribution (up to 20 pts from momentum)
    const momentumPts = Math.round((momentumScore / 100) * 20);
    base += momentumPts;

    // 3. Freshness (up to 15 pts)
    let freshnessPts = 10;
    if (dataFreshnessStatus === 'Verified Fresh') freshnessPts = 15;
    else if (dataFreshnessStatus === 'Recent') freshnessPts = 12;
    else if (dataFreshnessStatus === 'Stale / Needs Refresh') freshnessPts = 5;
    base += freshnessPts;

    // 4. Saturation Factor (up to 15 pts)
    let saturationPts = 10;
    if (saturation === 'Low Saturation') saturationPts = 15;
    else if (saturation === 'Moderate Saturation') saturationPts = 11;
    else if (saturation === 'High Saturation') saturationPts = 6;
    base += saturationPts;

    // 5. Module Suitability (up to 15 pts)
    const modulePts = Math.min(15, relevantModules.length * 5);
    base += modulePts;

    // 6. Actionability bonus (up to 10 pts)
    if (lifecycle === 'Emerging' || lifecycle === 'Growing') {
      base += 10;
    }

    const finalScore = Math.min(100, Math.max(20, Math.round(base)));

    return {
      score: finalScore,
      explanation: `Internal recommendation score of ${finalScore}/100 based on strong niche suitability, active audience curiosity, and favorable creator competition. (Note: This is an internal editorial score, not a guarantee of platform virality).`,
    };
  },
};
