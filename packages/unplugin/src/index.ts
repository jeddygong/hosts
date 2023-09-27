import { createUnplugin } from 'unplugin'
import { bold, green, red } from 'kolorist'
import { set } from '@unplugin-hosts/core'
import type { Options } from './types'

export default createUnplugin<Options>(options => ({
  name: 'unplugin-hosts',
  vite: {
    configureServer(server) {
      const _printUrls = server.printUrls
      const protocol = server.config.server.https ? 'https' : 'http'
      server.printUrls = () => {
        set(options.ip, options.host)?.then(() => {
          _printUrls()
          const port = server.config.server.port
          if (Array.isArray(options.host)) {
            options.host.forEach((host) => {
              console.log(`  ${green('➜')}  ${bold('Host')}: ${green(`${protocol}://${host}:${port}/`)}`)
            })
          }
          else {
            console.log(`  ${green('➜')}  ${bold('Host')}: ${green(`${protocol}://${options.host}:${port}/`)}`)
          }
        }).catch((e) => {
          _printUrls()
          if (e.message === '403')
            console.log(`  ${green('➜')}  ${bold(`unplugin-host${green('[warning]')}`)}: ${red('`/etc/hosts` access denied')}`)
        })
      }
    },
  },
}))
