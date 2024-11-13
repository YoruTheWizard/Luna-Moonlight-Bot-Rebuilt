import { Client } from 'discord.js';
import GoogleAI from '../../services/GoogleAI';
import getChannelHistory from '../../utils/AI/getChannelHistory';
import { consoleFormat as cf, Logger } from '../../utils';

export default async function (c: Client<true>) {
  const history = await getChannelHistory(c);
  GoogleAI.init(history)
    .then(() => {
      Logger.log(
        `> ${cf.b}Luna AI ${cf.r}configured ${cf.b + cf.fg}successfully${cf.fw + cf.r}`,
      );
    })
    .catch(err => Logger.error('event', 'starting Google AI instance', err));
}
