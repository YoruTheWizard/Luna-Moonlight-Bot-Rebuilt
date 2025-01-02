/*
  Reset = "\x1b[0m"
  Bold = "\x1b[1m"
  Dim = "\x1b[2m"
  Reset Bold and Dim = "\x1b[2m"
  Underline = "\x1b[4m"
  Blink = "\x1b[5m"
  Reverse = "\x1b[7m"
  Hidden = "\x1b[8m"

  FgBlack = "\x1b[30m"
  FgRed = "\x1b[31m"
  FgGreen = "\x1b[32m"
  FgYellow = "\x1b[33m"
  FgBlue = "\x1b[34m"
  FgMagenta = "\x1b[35m"
  FgCyan = "\x1b[36m"
  FgWhite = "\x1b[37m"
  FgGray = "\x1b[90m"

  BgBlack = "\x1b[40m"
  BgRed = "\x1b[41m"
  BgGreen = "\x1b[42m"
  BgYellow = "\x1b[43m"
  BgBlue = "\x1b[44m"
  BgMagenta = "\x1b[45m"
  BgCyan = "\x1b[46m"
  BgWhite = "\x1b[47m"
  BgGray = "\x1b[100m"
*/

/**
 * Text format options for console.
 *
 * Text
 * - r = reset text format
 * - b = bold
 * - d = dim
 * - u = underlined
 *
 * Colors
 * - fr: foreground red
 * - fg: foreground green
 * - fw: foreground white
 */
const consoleFormat = {
  // TEXT FORMAT
  /** Reset format */
  r: '\x1b[0m',
  /** Bold */
  b: '\x1b[1m',
  /** Dim */
  d: '\x1b[2m',
  /** Reset bold and dim */
  rb: '\x1b[22m',
  /** Underlined */
  u: '\x1b[4m',

  // FOREGROUND COLORS
  /** Foreground Red */
  fr: '\x1b[31m',
  /** Foreground Green */
  fg: '\x1b[32m',
  /** Foreground Yellow */
  fy: '\x1b[33m',
  /** Foreground White */
  fw: '\x1b[37m',

  // BACKGROUND COLORS

  // CUSTOM BITS
  success: '\x1b[1m\x1b[32m[✓]\x1b[0m',
  warning: '\x1b[1m\x1b[33m[!]\x1b[0m',
  error: '\x1b[1m\x1b[31m[!]\x1b[0m',
};

export { consoleFormat as cf };
