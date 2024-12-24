import {
  AttachmentBuilder,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { getCommandDescription, getMessage } from '../../json';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { Logger } from '../../utils';

const eventMsg = getCommandDescription('eventMessage');

export const data = new SlashCommandBuilder()
  .setName(eventMsg.name)
  .setDescription(eventMsg.description)

  // "event" option
  .addStringOption(opt =>
    opt
      .setName(eventMsg.options![0].name)
      .setDescription(eventMsg.options![0].description)
      .addChoices(...eventMsg.options![0].choices!)
      .setRequired(eventMsg.options![0].required),
  )

  // "message" option
  .addStringOption(opt =>
    opt
      .setName(eventMsg.options![1].name)
      .setDescription(eventMsg.options![1].description)
      .setRequired(eventMsg.options![1].required),
  )

  // "image" option
  .addAttachmentOption(opt =>
    opt
      .setName(eventMsg.options![2].name)
      .setDescription(eventMsg.options![2].description)
      .setRequired(eventMsg.options![2].required),
  )

  // "image-url" option
  .addStringOption(opt =>
    opt
      .setName(eventMsg.options![3].name)
      .setDescription(eventMsg.options![3].description)
      .setRequired(eventMsg.options![3].required),
  );

export const options: CommandOptions = {
  userPermissions: ['Administrator'],
};

export const run = async ({ interaction, client }: SlashCommandProps) => {
  const event = interaction.options.getString(eventMsg.options![0].name, true);
  const message = interaction.options.getString(
    eventMsg.options![1].name,
    true,
  );
  const image =
    interaction.options.getAttachment(eventMsg.options![2].name) ||
    interaction.options.getString(eventMsg.options![3].name);

  const attachment =
    typeof image === 'string' ? new AttachmentBuilder(image) : image;

  try {
    const channel = interaction.channel as TextChannel;
    await channel.send({
      content: `# ${event}\n||@everyone||\n${message}`,
      files: attachment ? [attachment] : [],
    });
    await interaction.reply({
      content: getMessage('messageSent'),
      ephemeral: true,
    });
  } catch (err) {
    return Logger.error('slash', 'eventMessage', err);
  }
};
