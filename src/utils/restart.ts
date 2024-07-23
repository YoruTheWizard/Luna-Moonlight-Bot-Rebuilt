import { Client, TextBasedChannel } from 'discord.js';
import start from '..';
import { ErrorLogger } from './errorLogger';

export const restart = async (
  channel: TextBasedChannel,
  client: Client,
): Promise<void> => {
  try {
    console.log('Restarting...');
    channel
      .send('Reiniciando...')
      .then(() => client.destroy())
      .then(() => {
        start();
        console.log('Restarted successfully');
      });
    return;
  } catch (err) {
    ErrorLogger.event('reiniciar', err);
  }
};
