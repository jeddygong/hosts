// src/index.ts
import { createUnplugin } from "unplugin";
import { bold, green, red } from "kolorist";
import { set } from "@unplugin-hosts/core";
var src_default = createUnplugin((options) => ({
  name: "unplugin-hosts",
  vite: {
    configureServer(server) {
      const _printUrls = server.printUrls;
      const protocol = server.config.server.https ? "https" : "http";
      server.printUrls = () => {
        var _a;
        (_a = set(options.ip, options.host)) == null ? void 0 : _a.then(() => {
          _printUrls();
          const port = server.config.server.port;
          if (Array.isArray(options.host)) {
            options.host.forEach((host) => {
              console.log(`  ${green("\u279C")}  ${bold("Host")}: ${green(`${protocol}://${host}:${port}/`)}`);
            });
          } else {
            console.log(`  ${green("\u279C")}  ${bold("Host")}: ${green(`${protocol}://${options.host}:${port}/`)}`);
          }
        }).catch((e) => {
          _printUrls();
          if (e.message === "403")
            console.log(`  ${green("\u279C")}  ${bold(`unplugin-host${green("[warning]")}`)}: ${red("`/etc/hosts` access denied")}`);
        });
      };
    }
  }
}));

export {
  src_default
};
