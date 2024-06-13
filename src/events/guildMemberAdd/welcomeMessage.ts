import { GuildMember, TextBasedChannel } from 'discord.js';
import { welcomeOn } from '../../config.json';
import { EmbedGenerator, ErrorLogger } from '../../utils';

export default async function (member: GuildMember) {
  try {
    const guild = member.guild;
    if (!guild) return;

    let options;
    for (const obj of welcomeOn)
      if (obj.server === member.guild.id) options = obj;
    if (!options) return;

    const welcomeEmbed = EmbedGenerator.welcome(member, guild, {
      imageUrl: options.image,
      rulesChannel: guild.rulesChannel || undefined,
      releasesChannel: options.releases,
      announcementsChannel: options.announcements,
    });

    const channel = guild.channels.cache.get(
      options.channel,
    )! as TextBasedChannel;
    channel.send({ content: `${member}`, embeds: [welcomeEmbed] });
  } catch (err) {
    ErrorLogger.event('sending welcome message', err);
  }
}