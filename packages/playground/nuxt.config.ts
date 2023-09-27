
export default defineNuxtConfig({
  modules: [
    ['unplugin-hosts/nuxt', {
      ip: '::1',
      host: 'hello.unplugin-hosts.com',
    }],
  ],
})
