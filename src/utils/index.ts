export * from './announcement';
export * from './content';
export * from './logger';
export * from './embeds';
export * from './updateConfig';
export * from './welcomeChannel';
export * from './restart';
export * from './activity';
export * from './consoleFormat';

/**
 * `[ Util ]`
 *
 * Returns *nothing* after `timeout`. Used for creating cooldowns between logic.
 *
 * @param timeout Timeout to await (milliseconds)
 */
export async function timeout(timeout: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, timeout);
  });
}

export function msToTime(ms: number) {
  if (ms < 0) ms = -ms;
  const time = {
    dia: Math.floor(ms / 86400000),
    hora: Math.floor(ms / 3600000) % 24,
    minuto: Math.floor(ms / 60000) % 60,
    segundo: Math.floor(ms / 1000) % 60,
  };
  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(val => val[1] + ' ' + (val[1] !== 1 ? val[0] + 's' : val[0]))
    .join(', ');
}
