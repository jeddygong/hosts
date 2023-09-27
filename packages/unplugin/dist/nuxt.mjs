// src/nuxt.ts
import { set } from "@unplugin-hosts/core";
import { bold, green, red } from "kolorist";
var nuxt_default = (options, nuxt) => {
  nuxt.hook("vite:serverCreated", (_, { isServer }) => {
    var _a;
    if (!isServer)
      return;
    console.log(`options: ${JSON.stringify(options)}`);
    (_a = set(options.ip, options.host)) == null ? void 0 : _a.then(() => {
      var _a2;
      const ENV_URL = process.env.__NUXT_DEV_PROXY__ || process.env.__NUXT_DEV_LISTENER__;
      console.log("__NUXT_DEV_PROXY__:", process.env.__NUXT_DEV_PROXY__);
      console.log("__NUXT_DEV_LISTENER__:", process.env.__NUXT_DEV_LISTENER__);
      const devUrl = (_a2 = JSON.parse(ENV_URL || "{}")) == null ? void 0 : _a2.url;
      const port = devUrl == null ? void 0 : devUrl.match(/:(\d+)\//)[1];
      const protocol = nuxt.options.devServer.https ? "https" : "http";
      if (Array.isArray(options.host)) {
        options.host.forEach((host) => {
          console.log(`  ${green("\u279C")}  ${bold("Host")}: ${green(`${protocol}://${host}:${port}/`)}`);
        });
      } else {
        console.log(`  ${green("\u279C")}  ${bold("Host")}: ${green(`${protocol}://${options.host}:${port}/`)}`);
      }
    }).catch((e) => {
      if (e.message === "403")
        console.log(`  ${green("\u279C")}  ${bold(`unplugin-host${green("[warning]")}`)}: ${red("`/etc/hosts` access denied")}`);
    });
  });
};
export {
  nuxt_default as default
};
