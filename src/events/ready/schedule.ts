import { Client, TextBasedChannel } from 'discord.js';
import * as config from '../../config.json';
import cron from 'node-cron';
import { events } from '../../json';

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
  console.log(`Scheduled events: ${eventNames.length ? '' : 'none'}`)
  if (eventNames.length) eventNames.map(event => console.log(` - ${event}`));
}
