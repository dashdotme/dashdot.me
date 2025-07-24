import markdownIt from "markdown-it";

export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({"src/assets": "."});

  // index
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  eleventyConfig.addFilter("removeHeadings", (content) => {
    return content.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '');
  });

  const md = new markdownIt();
  eleventyConfig.addPairedLiquidShortcode("note", (content) => {
    return `<div class="note">${md.render(content.trim())}</div>`;
  });

  // footnotes
  eleventyConfig.addLiquidShortcode("fnref", (num) => {
    return `<sup><a href="#fn${num}" id="fnref${num}">${num}</a></sup>`;
  });

  eleventyConfig.addPairedLiquidShortcode("footnotes", (content) => {
    return `<div class="footnotes">
      <h3>Footnotes</h3>
      ${content}
    </div>`;
  });

  eleventyConfig.addPairedLiquidShortcode("footnote", (content, num, title) => {
    const titleText = title ? ` ${title}` : '';
    return `<div class="footnote" id="fn${num}">
      <p><strong>${num}.${titleText}</strong> ${md.render(content.trim())}
      <a href="#fnref${num}" class="footnote-backlink">↩</a></p>
    </div>`;
  });

  // series
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
