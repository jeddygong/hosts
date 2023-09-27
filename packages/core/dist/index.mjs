// src/index.ts
import fs from "fs";
import sudo from "sudo-prompt";
var WINDOWS = process.platform === "win32";
var EOL = WINDOWS ? "\r\n" : "\n";
var PATH = WINDOWS ? "C:/Windows/System32/drivers/etc/hosts" : "/etc/hosts";
function get(filePath = PATH, preserveFormatting = false) {
  const lines = [];
  const content = fs.readFileSync(filePath, { encoding: "utf8" }).split(/\r?\n/);
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
    sudo.exec(
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
      fs.accessSync(PATH, fs.constants.W_OK);
    } catch (e) {
      return Promise.reject(Error("403"));
    }
    const stat = fs.statSync(PATH);
    fs.writeFileSync(PATH, normalizedLines.join(""), { mode: stat.mode });
    return Promise.resolve();
  } else {
    return sudoExec(`echo "${normalizedLines.join("")}" > ${PATH}`);
  }
}
export {
  PATH,
  get,
  set
};
