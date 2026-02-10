import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {
  title: {
    default: "FOSS.recipes",
    template: "%s - FOSS.recipes",
  },
  description:
    "Free, Open, Straightforward and Simple Recipes for Everyone!",
};

const navbar = (
  <Navbar
    logo={<span>🍽️ FOSS.recipes</span>}
    projectLink="https://github.com/chand1012/foss.recipes"
  />
);

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} ©{" "}
    <a href="https://github.com/chand1012" target="_blank">
      chand1012
    </a>
    .
  </Footer>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="🍽️" />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/chand1012/foss.recipes/blob/main"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
