import { GuildMember, PartialGuildMember, TextBasedChannel } from 'discord.js';
import { welcomeOn } from '../../config.json';
import { EmbedGenerator, Logger } from '../../utils';

export default async function (member: GuildMember | PartialGuildMember) {
  try {
    const guild = member.guild;
    if (!guild) return;

    let options;
    for (const obj of welcomeOn)
      if (obj.server === member.guild.id) options = obj;
    if (!options) return;

    const goodbyeEmbed = EmbedGenerator.goodbye(member, guild, {
      imageUrl: options.goodbyeImage,
      color: options.goodbyeColor,
    });

    const channel = guild.channels.cache.get(
      options.channel,
    )! as TextBasedChannel;
    channel.send({ embeds: [goodbyeEmbed] });
  } catch (err) {
    Logger.error('event', 'sending goodbye message', err);
  }
}
