import nextra from "nextra";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  remarkPlugins: [
    [
      remarkMdxDisableExplicitJsx,
      { whiteList: ["table", "thead", "tbody", "tr", "th", "td"] },
    ],
  ],
});

export default withNextra();
