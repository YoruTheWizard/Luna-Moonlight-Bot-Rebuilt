import { Client, TextBasedChannel } from 'discord.js';
import start from '..';
import { Logger } from './logger';

/**
 * `[ Util ]`
 *
 * Restarts the client
 *
 * @param client client object
 * @param channel current channel
 */
export const restart = async (
  client: Client,
  channel?: TextBasedChannel,
): Promise<void> => {
  try {
    Logger.success('Restarting...');
    if (channel)
      channel
        .send('Reiniciando...')
        .then(() => client.destroy())
        .then(() => {
          start();
          Logger.success('Restarted successfully');
        });
    else {
      await client.destroy();
      start();
      Logger.success('Restarted successfully');
    }
  } catch (err) {
    Logger.error('event', 'restarting client', err);
  }
};
