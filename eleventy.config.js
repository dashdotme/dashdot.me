import markdownIt from "markdown-it";
import { fromHighlighter } from "@shikijs/markdown-it";
import { createHighlighter } from "shiki";
import { randomBytes, pbkdf2Sync, createCipheriv } from "node:crypto";

export default async (eleventyConfig) => {
  // treat src/assets as root for management of favicons etc.
  eleventyConfig.addPassthroughCopy({"src/assets": "."});

  // setup syntax highlighting with Shiki
  const highlighter = await createHighlighter({
    themes: ["catppuccin-mocha", "catppuccin-latte"],
    langs: ["nix", "bash", "terraform",  "python", "rust", "javascript", "typescript", "html", "css", "json", "markdown"],
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

  // collections
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  eleventyConfig.addCollection("publicPosts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(post => !post.data.draft);
  });

  // sections: posts tagged "personal" are personal; everything else defaults to technical
  const isPersonal = (post) => (post.data.tags || []).includes("personal");

  eleventyConfig.addCollection("technicalPosts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(post => !post.data.draft && !isPersonal(post));
  });

  eleventyConfig.addCollection("personalPosts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(post => !post.data.draft && isPersonal(post));
  });

  // distinct series, each with its parts in reading order
  eleventyConfig.addCollection("seriesList", (collectionApi) => {
    const groups = {};
    collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(post => !post.data.draft && post.data.series)
      .forEach(post => {
        (groups[post.data.series] ||= []).push(post);
      });
    return Object.entries(groups).map(([name, posts]) => ({
      name,
      posts: posts.sort((a, b) => new Date(a.date) - new Date(b.date)),
    }));
  });

  // group posts (newest first) by calendar year for the index list
  eleventyConfig.addFilter("groupByYear", (posts) => {
    const groups = {};
    [...posts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(post => {
        const year = new Date(post.date).getUTCFullYear();
        (groups[year] ||= []).push(post);
      });
    return Object.entries(groups)
      .sort((a, b) => b[0] - a[0])
      .map(([year, posts]) => ({ year, posts }));
  });

  // encrypt content for draft posts
  eleventyConfig.addFilter("encrypt", (content) => {
    const password = process.env.DRAFT_KEY;
    if (!password) return "";
    const salt = randomBytes(16);
    const key = pbkdf2Sync(password, salt, 100000, 32, "sha256");
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(content, "utf8"), cipher.final()]);
    return JSON.stringify({
      s: salt.toString("base64"),
      i: iv.toString("base64"),
      t: cipher.getAuthTag().toString("base64"),
      d: encrypted.toString("base64")
    });
  });

  eleventyConfig.addFilter("removeHeadings", (content) => {
    return content.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '');
  });

  // safely emit a value as a JSON string (for JSON-LD structured data)
  eleventyConfig.addFilter("jsonString", (value) => JSON.stringify(value ?? ""));

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
