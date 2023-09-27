import { set } from '@unplugin-hosts/core'
import { bold, green, red } from 'kolorist'
import { Nuxt } from 'nuxt/schema'
import type { Options } from './types'

export default (options: Options, nuxt: Nuxt) => {
  nuxt.hook('vite:serverCreated', (_: unknown, { isServer }: { isServer: boolean }) => {
    if (!isServer) return
    set(options.ip, options.host)?.then(() => {
      // workaround: compatible with nuxt 3.7
      const ENV_URL = process.env.__NUXT_DEV_PROXY__ || process.env.__NUXT_DEV_LISTENER__
      const devUrl = JSON.parse(ENV_URL || '{}')?.url
      const port = devUrl?.match(/:(\d+)\//)[1]
      const protocol = nuxt.options.devServer.https ? 'https' : 'http'
      if (Array.isArray(options.host)) {
        options.host.forEach((host) => {
          console.log(`  ${green('➜')}  ${bold('Host')}: ${green(`${protocol}://${host}:${port}/`)}`)
        })
      }
      else {
        console.log(`  ${green('➜')}  ${bold('Host')}: ${green(`${protocol}://${options.host}:${port}/`)}`)
      }
    }).catch((e) => {
      if (e.message === '403')
        console.log(`  ${green('➜')}  ${bold(`unplugin-host${green('[warning]')}`)}: ${red('`/etc/hosts` access denied')}`)
    })
  })
}
