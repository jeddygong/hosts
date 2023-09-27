import fs from 'node:fs'
import sudo from 'sudo-prompt'

const WINDOWS = process.platform === 'win32'
const EOL = WINDOWS ? '\r\n' : '\n'
export const PATH = WINDOWS
  ? 'C:/Windows/System32/drivers/etc/hosts'
  : '/etc/hosts'

export function get(filePath: string = PATH, preserveFormatting = false) {
  const lines: Array<[string, string] | string> = []
  const content = fs.readFileSync(filePath, { encoding: 'utf8' }).split(/\r?\n/)
  content.forEach((line) => {
    const lineSansComments = line.replace(/#.*/, '')
    const matches = /^\s*?(.+?)\s+(.+?)\s*$/.exec(lineSansComments)
    if (matches && matches.length === 3) {
      // Found a hosts entry
      const ip = matches[1]
      const host = matches[2]
      lines.push([ip, host])
    }
    else {
      // Found a comment, blank line, or something else
      if (preserveFormatting)
        lines.push(line)
    }
  })
  return lines
}

function sudoExec(args: string) {
  return new Promise((resolve, reject) => {
    sudo.exec(
      args,
      {
        name: 'Unplugin Hosts Change Request',
      },
      (error, stdout) => {
        if (error)
          reject(new Error(`Encountered an error: ${error}`))

        else
          resolve(stdout)
      },
    )
  })
}

async function runPromisesSerially(tasks: (() => Promise<unknown>)[]) {
  for (const task of tasks)
    await task()
}

export async function set(ip: string, host: string | string[]) {
  if (Array.isArray(host)) {
    await runPromisesSerially(host.map(h => () => set(ip, h)))
    return Promise.resolve()
  }

  const lines = get(PATH, true)
  // Skip when exists
  if (lines.some(l => l[0] === ip && l[1] === host))
    return Promise.resolve()

  // If the last line is empty, or just whitespace, then insert the new entry
  // right before it
  const lastLine = lines[lines.length - 1]
  if (typeof lastLine === 'string' && /\s*/.test(lastLine))
    lines.splice(lines.length - 1, 0, [ip, host])
  else
    lines.push([ip, host])

  const normalizedLines = lines.map((line: string | string[], lineNum: number) => {
    if (Array.isArray(line))
      line = `${line[0]} ${line[1]}`
    return line + (lineNum === lines.length - 1 ? '' : EOL)
  })

  if (WINDOWS) {
    // Check /etc/hosts write permissions
    try {
      fs.accessSync(PATH, fs.constants.W_OK)
    }
    catch (e) {
      return Promise.reject(Error('403'))
    }
    const stat = fs.statSync(PATH)
    fs.writeFileSync(PATH, normalizedLines.join(''), { mode: stat.mode })
    return Promise.resolve()
    // const set = new Set(normalizedLines)
    // let normalizedString = Array.from(set).map(line => `echo ${line}`).join('\n')
    // normalizedString = normalizedString.replace(/\)/g, '^)')
    // const hostsString = `(\n${normalizedString}\n) > ${PATH}\n`

    // return sudoExec(`${hostsString}`)
  }
  else {
    return sudoExec(`echo "${normalizedLines.join('')}" > ${PATH}`)
  }
}
