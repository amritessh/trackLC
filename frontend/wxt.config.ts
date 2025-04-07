import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: "My Extension",
    description: "trackLC Chrome extension built with WXT",
    version: "1.0.0",
    manifest_version: 3,
    permissions: ["storage"],
    action: {
      default_popup: "src/popup/index.html",
      default_icon: {
        "16": "src/assets/icons/icon-16.png",
        "32": "src/assets/icons/icon-32.png",
        "48": "src/assets/icons/icon-48.png",
        "128": "src/assets/icons/icon-128.png"
      }
    },
    options_ui: {
      page: "src/options/index.html",
      open_in_tab: true
    },
    background: {
      service_worker: "src/background/index.js",
      type: "module"
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["src/content/index.js"]
      }
    ],
    icons: {
      "16": "src/assets/icons/icon-16.png",
      "32": "src/assets/icons/icon-32.png",
      "48": "src/assets/icons/icon-48.png",
      "128": "src/assets/icons/icon-128.png"
    }
  },
  srcDir: ".",
  outDir: "dist",
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
})