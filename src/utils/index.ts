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
