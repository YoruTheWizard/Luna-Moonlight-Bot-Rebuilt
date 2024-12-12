import { Client, PresenceStatusData } from 'discord.js';
import { updateConfig } from './updateConfig';
import { Logger } from './logger';
import Luna from './Luna';

export async function setBotStatus(
  status: PresenceStatusData,
  client: Client<true>,
  log: boolean = true,
) {
  client.user.setStatus(status);
  if (status === 'invisible' && !Luna.isAsleep) {
    Luna.isAsleep = true;
    Luna.isAIOn = false;
  }
  if (status !== 'invisible' && Luna.isAsleep) {
    Luna.isAsleep = false;
    Luna.isAIOn = true;
  }
  await updateConfig('status', status);
  if (log) Logger.log(`Set bot status to "${status}"`);
}
