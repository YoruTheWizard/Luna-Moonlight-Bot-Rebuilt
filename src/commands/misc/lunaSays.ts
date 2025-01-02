import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { getCommandDescription, getMessage } from '../../utils/json';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { Logger } from '../../utils/misc';

const lunaSays = getCommandDescription('lunaSays');
const msgSent = getMessage('messageSent');

export const data = new SlashCommandBuilder()
  .setName(lunaSays.name)
  .setDescription(lunaSays.description)

  // "message" option
  .addStringOption(opt =>
    opt
      .setName(lunaSays.options![0].name)
      .setDescription(lunaSays.options![0].description)
      .setRequired(true),
  )

  // "reply" option
  .addStringOption(opt =>
    opt
      .setName(lunaSays.options![1].name)
      .setDescription(lunaSays.options![1].description),
  );

export const options: CommandOptions = {
  ownerOnly: true,
  awakeOnly: true,
};

export const run = async ({
  interaction,
}: SlashCommandProps): Promise<void> => {
  const message = interaction.options.getString(
    lunaSays.options![0].name,
    true,
  );
  const replyId = interaction.options.getString(lunaSays.options![1].name);

  try {
    const channel = interaction.channel as TextChannel;
    if (replyId) {
      const reply = channel.messages.cache.get(replyId);
      if (!reply) return;
      await reply.reply(message);
    } else await channel.send(message);
    await interaction.reply({ content: msgSent, ephemeral: true });
  } catch (err) {
    Logger.error('slash', 'lunadiz', err);
  }
};
