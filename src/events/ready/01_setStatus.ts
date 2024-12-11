import { Client, PresenceStatusData } from 'discord.js';
import { status } from '../../config.json';
import { consoleFormat as cf, Logger } from '../../utils';

export default function (c: Client<true>) {
  if (!status) c.user.setStatus('online');
  else c.user.setStatus(status as PresenceStatusData);
  const msg = `> ${cf.b}Status:${cf.r} ${status || 'none'}`;
  Logger.log(msg);
}
