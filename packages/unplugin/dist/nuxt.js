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

// src/nuxt.ts
var nuxt_exports = {};
__export(nuxt_exports, {
  default: () => nuxt_default
});
module.exports = __toCommonJS(nuxt_exports);
var import_core = require("@unplugin-hosts/core");
var import_kolorist = require("kolorist");
var nuxt_default = (options, nuxt) => {
  nuxt.hook("vite:serverCreated", (_, { isServer }) => {
    var _a;
    if (!isServer)
      return;
    console.log(`options: ${JSON.stringify(options)}`);
    (_a = (0, import_core.set)(options.ip, options.host)) == null ? void 0 : _a.then(() => {
      var _a2;
      const ENV_URL = process.env.__NUXT_DEV_PROXY__ || process.env.__NUXT_DEV_LISTENER__;
      console.log("__NUXT_DEV_PROXY__:", process.env.__NUXT_DEV_PROXY__);
      console.log("__NUXT_DEV_LISTENER__:", process.env.__NUXT_DEV_LISTENER__);
      const devUrl = (_a2 = JSON.parse(ENV_URL || "{}")) == null ? void 0 : _a2.url;
      const port = devUrl == null ? void 0 : devUrl.match(/:(\d+)\//)[1];
      const protocol = nuxt.options.devServer.https ? "https" : "http";
      if (Array.isArray(options.host)) {
        options.host.forEach((host) => {
          console.log(`  ${(0, import_kolorist.green)("\u279C")}  ${(0, import_kolorist.bold)("Host")}: ${(0, import_kolorist.green)(`${protocol}://${host}:${port}/`)}`);
        });
      } else {
        console.log(`  ${(0, import_kolorist.green)("\u279C")}  ${(0, import_kolorist.bold)("Host")}: ${(0, import_kolorist.green)(`${protocol}://${options.host}:${port}/`)}`);
      }
    }).catch((e) => {
      if (e.message === "403")
        console.log(`  ${(0, import_kolorist.green)("\u279C")}  ${(0, import_kolorist.bold)(`unplugin-host${(0, import_kolorist.green)("[warning]")}`)}: ${(0, import_kolorist.red)("`/etc/hosts` access denied")}`);
    });
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
