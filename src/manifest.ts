import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/enabled16.png',
    32: 'img/enabled32.png',
    48: 'img/enabled48.png',
    128: 'img/enabled128.png',
  },
  action: {
    default_icon: 'img/logo-48.png',
  },
  devtools_page: 'devtools.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/contentScript/index.ts'],
    },
  ],
  side_panel: {
    default_path: 'sidepanel.html',
  },
  web_accessible_resources: [
    {
      resources: [
        'img/disabled16.png',
        'img/disabled32.png',
        'img/disabled48.png',
        'img/disabled128.png',
        'img/enabled16.png',
        'img/enabled32.png',
        'img/enabled48.png',
        'img/enabled128.png',
      ],
      matches: ['<all_urls>'],
    },
  ],
  permissions: ['sidePanel', 'storage', 'tabs', 'activeTab'],
})
