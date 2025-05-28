import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

import pluginFilters from "./_config/filters.js";

/** @param {import{"@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
  // Copy contents of `public` folder to the output folder
  eleventyConfig
    .addPassthroughCopy({
    "./public/": "/"
    })
    .addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

  // Run eleventy when these files change:
  // Watch CSS files
  eleventyConfig.addWatchTarget("css/**/*.css");
  // Watch images for the image pipeline
  eleventyConfig.addWatchTarget("garden/**/*.{svg,webp,png,jpg,jpeg,gif");

  // Bundle <style> content and adds a {% css %} paired shortcode
  eleventyConfig.addBundle("css", {
    toFileDirectory: "dist",
    // Add a <style> content to `css` bundle
    bundleHtmlContentFromSelector: "style",
  });

  // Bundle <script> content and adds a {% js %} paired shortcode
  eleventyConfig.addBundle("js", {
    toFileDirectory: "dist",
    bundleHtmlContentFromSelector: "script",
  });

  // Eleventy plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    perAttributes: { tabIndex: 0 }
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    templateData: {
      eleventyNavigation: {
        key: "Feed",
        order: 4
      }
    },
    collection: {
      name: "posts",
      limit: 20,
    },
    metadata: {
      language: "en",
      title: "GeauxWeisbeck4.dev",
      subtitle: "Digital Garden of Andrew Weisbeck",
      base: "https://geauxweisbeck4.dev",
      author: {
        name: "Andrew Weisbeck"
      }
    }
  });

  // Image optimization
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // Output formats for each image.
    formats: ["avif", "webp", "auto"],
    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      }
    },
    sharpOptions: {
      animated: true,
    },
  });

  eleventyConfig.addPlugin(pluginFilters);
  
  eleventyConfig.addPlugin(IdAttributePlugin);

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return (new Date()).toISOString();
  });
};

export const config = {
  templateFormats: [
    "md",
    "njk",
    "html",
    "liquid",
    "11ty.js",
  ],
  // Pre-process *.md files with: 
  markdownTemplateEngine: "njk",

  // Pre-process *.html files with:
  htmlTemplateEngine: "njk",

  dir: {
    input: "garden",
    includes: "../_includes",
    data: "../data",
    output: "_site"
  },
};