import { Client, TextBasedChannel } from 'discord.js';
import * as config from '../../config.json';
import cron from 'node-cron';
import { events } from '../../json';
import { consoleFormat as cf, Logger } from '../../utils';

export default function (c: Client<true>) {
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
        | TextBasedChannel
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
    '* 22 * * *',
    () => {
      c.user.setStatus('invisible');
    },
    { timezone: 'America/Sao_Paulo' },
  );
  Logger.log('  - time to sleep');

  cron.schedule(
    '* 6 * * *',
    () => {
      c.user.setStatus('online');
    },
    { timezone: 'America/Sao_Paulo' },
  );
  Logger.log('  - wake up');

  if (eventNames.length) eventNames.map(event => Logger.log(`  - ${event}`));
}
