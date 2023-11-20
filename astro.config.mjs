import { defineConfig } from "astro/config";
import qwikdev from "@qwikdev/astro";
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [qwikdev(), tailwind()],
  output: "server",
  adapter: vercel(),
});
