import markdownIt from "markdown-it";
export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/assets": "."});

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  const md = new markdownIt();
  eleventyConfig.addPairedLiquidShortcode("note", function(content) {
    return `<div class="note">${md.renderInline(content.trim())}</div>`;
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
