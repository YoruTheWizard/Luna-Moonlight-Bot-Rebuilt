import { Client, PresenceStatusData } from 'discord.js';
import { updateConfig } from '../misc/updateConfig';
import { Logger } from '../misc/logger';
import Luna from '.';

/**
 * `[ Luna ]`
 *
 * Changes bot presence status
 *
 * @param status The status to be set
 * @param client Client object
 * @param log Rather the status change should be logged in console or not. Default is `true`
 */
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
