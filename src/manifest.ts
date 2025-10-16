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
  permissions: ['storage', 'activeTab', 'scripting'],
} as any)
