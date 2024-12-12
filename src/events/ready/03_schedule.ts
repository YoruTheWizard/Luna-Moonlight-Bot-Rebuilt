import { Client, TextChannel } from 'discord.js';
import cron from 'node-cron';
import { events } from '../../json';
import { consoleFormat as cf, Logger } from '../../utils';
import Luna from '../../utils/Luna';
import { setBotStatus } from '../../utils/status';
import { schedule } from '../../config.json';

export default async function (c: Client<true>) {
  const eventNames: string[] = [];
  let cooldown = 0;
  for (const event of events) {
    for (const server of event.servers) {
      const typingCooldown = cooldown + (event.typingCooldown || 1000);
      const sendCooldown =
        typingCooldown + (event.sendCooldown || event.message.length * 100);

      const guild = c.guilds.cache.get(server.id);
      if (!guild) continue;

      const channel = guild.channels.cache.get(server.channel) as
        | TextChannel
        | undefined;
      if (!channel) continue;

      cron
        .schedule(
          event.cronString,
          () => {
            setTimeout(() => {
              channel.sendTyping();
            }, typingCooldown);
            setTimeout(() => {
              channel.send(event.message);
            }, sendCooldown);
          },
          { timezone: 'America/Sao_Paulo' },
        )
        .start();
      cooldown += sendCooldown;
      eventNames.push(event.name);
    }
  }
  Logger.log(
    `> ${cf.b}Scheduled events:${cf.r} ${eventNames.length ? '' : 'none'}`,
  );

  cron.schedule(
    `0 ${schedule.sleep} * * *`,
    async () => {
      Luna.isAsleep = true;
      Luna.isAIOn = false;
      await setBotStatus('invisible', c);
      Logger.log(`Luna went to sleep...`);
    },
    { timezone: 'America/Sao_Paulo' },
  );
  Logger.log('  - time to sleep');

  cron.schedule(
    `0 ${schedule.wakeUp} * * Mon-Fri`,
    async () => {
      Luna.isAsleep = false;
      Luna.isAIOn = true;
      await setBotStatus('online', c);
      Logger.log('Luna woke up!');
    },
    { timezone: 'America/Sao_Paulo' },
  );
  Logger.log('  - wake up');

  cron.schedule(
    `0 ${schedule.wakeUp + 2} * * Sun,Sat`,
    async () => {
      Luna.isAsleep = false;
      Luna.isAIOn = true;
      await setBotStatus('online', c);
      Logger.log('Luna woke up!');
    },
    { timezone: 'America/Sao_Paulo' },
  );
  Logger.log('  - wake up weekend');

  if (eventNames.length) eventNames.map(event => Logger.log(`  - ${event}`));
}
