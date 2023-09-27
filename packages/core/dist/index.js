"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PATH: () => PATH,
  get: () => get,
  set: () => set
});
module.exports = __toCommonJS(src_exports);
var import_node_fs = __toESM(require("fs"));
var import_sudo_prompt = __toESM(require("sudo-prompt"));
var WINDOWS = process.platform === "win32";
var EOL = WINDOWS ? "\r\n" : "\n";
var PATH = WINDOWS ? "C:/Windows/System32/drivers/etc/hosts" : "/etc/hosts";
function get(filePath = PATH, preserveFormatting = false) {
  const lines = [];
  const content = import_node_fs.default.readFileSync(filePath, { encoding: "utf8" }).split(/\r?\n/);
  content.forEach((line) => {
    const lineSansComments = line.replace(/#.*/, "");
    const matches = /^\s*?(.+?)\s+(.+?)\s*$/.exec(lineSansComments);
    if (matches && matches.length === 3) {
      const ip = matches[1];
      const host = matches[2];
      lines.push([ip, host]);
    } else {
      if (preserveFormatting)
        lines.push(line);
    }
  });
  return lines;
}
function sudoExec(args) {
  return new Promise((resolve, reject) => {
    import_sudo_prompt.default.exec(
      args,
      {
        name: "Unplugin Hosts Change Request"
      },
      (error, stdout) => {
        if (error)
          reject(new Error(`Encountered an error: ${error}`));
        else
          resolve(stdout);
      }
    );
  });
}
async function runPromisesSerially(tasks) {
  for (const task of tasks)
    await task();
}
async function set(ip, host) {
  if (Array.isArray(host)) {
    await runPromisesSerially(host.map((h) => () => set(ip, h)));
    return Promise.resolve();
  }
  const lines = get(PATH, true);
  if (lines.some((l) => l[0] === ip && l[1] === host))
    return Promise.resolve();
  const lastLine = lines[lines.length - 1];
  if (typeof lastLine === "string" && /\s*/.test(lastLine))
    lines.splice(lines.length - 1, 0, [ip, host]);
  else
    lines.push([ip, host]);
  const normalizedLines = lines.map((line, lineNum) => {
    if (Array.isArray(line))
      line = `${line[0]} ${line[1]}`;
    return line + (lineNum === lines.length - 1 ? "" : EOL);
  });
  if (WINDOWS) {
    try {
      import_node_fs.default.accessSync(PATH, import_node_fs.default.constants.W_OK);
    } catch (e) {
      return Promise.reject(Error("403"));
    }
    const stat = import_node_fs.default.statSync(PATH);
    import_node_fs.default.writeFileSync(PATH, normalizedLines.join(""), { mode: stat.mode });
    return Promise.resolve();
  } else {
    return sudoExec(`echo "${normalizedLines.join("")}" > ${PATH}`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PATH,
  get,
  set
});
