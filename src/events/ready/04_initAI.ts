import { Client } from 'discord.js';
import GoogleAI from '../../services/GoogleAI';
import getChannelHistory from '../../utils/AI/getChannelHistory';
import { consoleFormat as cf, Logger } from '../../utils';
import OpenAI_API from '../../services/OpenAI';

export default async function (c: Client<true>) {
  const history = await getChannelHistory(c);
  GoogleAI.init(history)
    .then(() => {
      Logger.log(
        `> ${cf.b}Luna AI ${cf.r}configured ${cf.b + cf.fg}successfully${cf.fw + cf.r}`,
      );
      Logger.log('  - Google AI ready');
      const openai = OpenAI_API.init();
      if (openai) Logger.log('  - OpenAI ready');
      else
        Logger.error(
          'event',
          'starting OpenAI instance',
          'Instance did not initiate',
        );
    })
    .catch(err => Logger.error('event', 'starting Google AI instance', err));
}
