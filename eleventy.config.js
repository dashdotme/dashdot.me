import markdownIt from "markdown-it";

export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({"src/assets": "."});

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  const md = new markdownIt();
  eleventyConfig.addPairedLiquidShortcode("note", (content) => {
    return `<div class="note">${md.renderInline(content.trim())}</div>`;
  });

  eleventyConfig.addFilter("getSeriesPosts", (collectionApi, currentSeries) => {
    if (!currentSeries) return [];
    return collectionApi.all
      .filter(post => post.data.series === currentSeries)
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
      .map((post, index) => ({
        ...post,
        seriesIndex: index + 1
      }));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "../layouts"
    },
    markdownTemplateEngine: "liquid"
  };
};
