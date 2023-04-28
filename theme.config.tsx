import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>FOSS.recipes</span>,
  project: {
    link: "https://github.com/chand1012/foss.recipes",
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  docsRepositoryBase: "https://github.com/chand1012/foss.recipes/blob/main",
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://github.com/chand1012" target="_blank">
          chand1012
        </a>
        .
      </span>
    ),
  },
  useNextSeoProps: () => ({
    titleTemplate: "%s - FOSS.recipes",
  }),
};

export default config;
