import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Hosts from 'unplugin-hosts/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Hosts({
      ip: '::1',
      host: ['hello.unplugin-hosts.com', 'world.unplugin-hosts.com'],
    }),
  ],
})
