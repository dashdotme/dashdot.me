export default {
  eleventyComputed: {
    permalink: (data) => {
      if (data.draft && !process.env.DRAFT_KEY) return false;
      return data.permalink;
    },
    eleventyExcludeFromCollections: (data) => {
      if (data.draft && !process.env.DRAFT_KEY) return true;
      return data.eleventyExcludeFromCollections;
    },
  },
};
