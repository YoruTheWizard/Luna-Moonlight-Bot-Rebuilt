import { Client, TextBasedChannel } from 'discord.js';
import start from '..';
import { Logger } from './logger';

export const restart = async (
  channel: TextBasedChannel,
  client: Client,
): Promise<void> => {
  try {
    Logger.success('Restarting...');
    channel
      .send('Reiniciando...')
      .then(() => client.destroy())
      .then(() => {
        start();
        Logger.success('Restarted successfully');
      });
    return;
  } catch (err) {
    Logger.error('event', 'reiniciar', err);
  }
};
