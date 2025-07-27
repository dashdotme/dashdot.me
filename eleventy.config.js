import markdownIt from "markdown-it";
import { fromHighlighter } from "@shikijs/markdown-it";
import { createHighlighter } from "shiki";

export default async (eleventyConfig) => {
  // treat src/assets as root for management of favicons etc.
  eleventyConfig.addPassthroughCopy({"src/assets": "."});

  // setup syntax highlighting with Shiki
  const highlighter = await createHighlighter({
    themes: ["catppuccin-mocha", "catppuccin-latte"],
    langs: ["nix", "bash", "python", "rust", "javascript", "typescript", "html", "css", "json", "markdown"],
  });

  const md = new markdownIt({
    html: true,
    linkify: true,
    typographer: true
  }).use(
    fromHighlighter(highlighter, {
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha"
      }
    })
  );

  eleventyConfig.setLibrary("md", md);

  // index
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  eleventyConfig.addFilter("removeHeadings", (content) => {
    return content.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '');
  });

  // notes
  eleventyConfig.addPairedLiquidShortcode("note", (content, type) => {
    const className = type ? `note ${type}` : 'note';
    return `<div class="${className}">${md.render(content.trim())}</div>`;
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
