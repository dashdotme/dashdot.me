const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default {
  ogType: "article",
  eleventyComputed: {
    permalink: (data) => {
      if (data.draft && !process.env.DRAFT_KEY) return false;
      return data.permalink;
    },
    eleventyExcludeFromCollections: (data) => {
      if (data.draft && !process.env.DRAFT_KEY) return true;
      return data.eleventyExcludeFromCollections;
    },
    // "personal" when tagged so, otherwise "technical"
    section: (data) => ((data.tags || []).includes("personal") ? "personal" : "technical"),
    // roman numeral of this post within its series (empty when not in a series)
    seriesRoman: (data) => {
      if (!data.series) return "";
      const parts = (data.collections.all || [])
        .filter((p) => p.data.series === data.series)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const idx = parts.findIndex((p) => p.data.title === data.title);
      return idx < 0 ? "" : ROMAN[idx] || String(idx + 1);
    },
  },
};
