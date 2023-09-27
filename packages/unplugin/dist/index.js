"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_unplugin = require("unplugin");
var import_kolorist = require("kolorist");
var import_core = require("@unplugin-hosts/core");
var src_default = (0, import_unplugin.createUnplugin)((options) => ({
  name: "unplugin-hosts",
  vite: {
    configureServer(server) {
      const _printUrls = server.printUrls;
      const protocol = server.config.server.https ? "https" : "http";
      server.printUrls = () => {
        var _a;
        (_a = (0, import_core.set)(options.ip, options.host)) == null ? void 0 : _a.then(() => {
          _printUrls();
          const port = server.config.server.port;
          if (Array.isArray(options.host)) {
            options.host.forEach((host) => {
              console.log(`  ${(0, import_kolorist.green)("\u279C")}  ${(0, import_kolorist.bold)("Host")}: ${(0, import_kolorist.green)(`${protocol}://${host}:${port}/`)}`);
            });
          } else {
            console.log(`  ${(0, import_kolorist.green)("\u279C")}  ${(0, import_kolorist.bold)("Host")}: ${(0, import_kolorist.green)(`${protocol}://${options.host}:${port}/`)}`);
          }
        }).catch((e) => {
          _printUrls();
          if (e.message === "403")
            console.log(`  ${(0, import_kolorist.green)("\u279C")}  ${(0, import_kolorist.bold)(`unplugin-host${(0, import_kolorist.green)("[warning]")}`)}: ${(0, import_kolorist.red)("`/etc/hosts` access denied")}`);
        });
      };
    }
  }
}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
