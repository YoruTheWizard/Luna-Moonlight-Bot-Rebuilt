import { Client, PresenceStatusData } from 'discord.js';
import { status, schedule } from '../../config.json';
import { cf, Logger } from '../../utils/misc';
import { setBotStatus } from '../../utils/Luna/status';
import { getCurrentDate } from '../../utils/content';

export default async function (c: Client<true>) {
  const hr = getCurrentDate().getHours();
  if (hr >= schedule.sleep || hr < schedule.wakeUp) {
    await setBotStatus('invisible', c, false);
    Logger.log(`> ${cf.b}Status:${cf.r} invisible`);
    return;
  }
  if (!status) c.user.setStatus('online');
  else c.user.setStatus(status as PresenceStatusData);
  Logger.log(`> ${cf.b}Status:${cf.r} ${status || 'online'}`);
}
