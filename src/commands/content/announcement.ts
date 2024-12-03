import type { CommandOptions, SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';

import { Announcement, setCommandTitleOption } from '../../utils';
import { getCommandDescription } from '../../json';

const announcement = getCommandDescription('announcement');
const announcement_release = getCommandDescription('announcement_release');
const announcement_title = getCommandDescription('announcement_title');
const announcement_recruitment = getCommandDescription(
  'announcement_recruitment',
);

const releaseOptions = announcement_release.options!;
const titleOptions = announcement_title.options!;
// const recruitmentOptions = announcement_recruitment.options!;
const releaseTypeOptionChoices = releaseOptions[0].choices!;

export const data = new SlashCommandBuilder()
  .setName(announcement.name)
  .setDescription(announcement.description)

  // "release" subcommand
  .addSubcommand(sub =>
    sub
      .setName(announcement_release.subName!)
      .setDescription(announcement_release.description)

      // "title" option
      .addStringOption(opt => setCommandTitleOption(opt))

      // "type" option
      .addStringOption(opt =>
        opt
          .setName(releaseOptions[0].name)
          .setDescription(releaseOptions[0].description)
          .addChoices(
            {
              name: releaseTypeOptionChoices[0].name,
              value: releaseTypeOptionChoices[0].value,
            },
            {
              name: releaseTypeOptionChoices[1].name,
              value: releaseTypeOptionChoices[1].value,
            },
          )
          .setRequired(true),
      )

      // "numbers" option
      .addStringOption(opt =>
        opt
          .setName(releaseOptions[1].name)
          .setDescription(releaseOptions[1].description)
          .setRequired(true),
      )

      // "links" option
      .addStringOption(opt =>
        opt
          .setName(releaseOptions[2].name)
          .setDescription(releaseOptions[2].description)
          .setRequired(true),
      )

      // "volume" option
      .addNumberOption(opt =>
        opt
          .setName(releaseOptions[3].name)
          .setDescription(releaseOptions[3].description),
      )

      // "description" option
      .addStringOption(opt =>
        opt
          .setName(releaseOptions[4].name)
          .setDescription(releaseOptions[4].description),
      )

      // "image" option
      .addAttachmentOption(opt =>
        opt
          .setName(releaseOptions[5].name)
          .setDescription(releaseOptions[5].description),
      )

      // "image-url" option
      .addStringOption(opt =>
        opt
          .setName(releaseOptions[6].name)
          .setDescription(releaseOptions[6].description),
      ),
  )

  // "title" subcommand
  .addSubcommand(sub =>
    sub
      .setName(announcement_title.subName!)
      .setDescription(announcement_title.description)

      // "name" option
      .addStringOption(opt =>
        opt
          .setName(titleOptions[0].name)
          .setDescription(titleOptions[0].description)
          .setRequired(true),
      )

      // "links" option
      .addStringOption(opt =>
        opt
          .setName(titleOptions[1].name)
          .setDescription(titleOptions[1].description)
          .setRequired(true),
      )

      // "sinopsys" option
      .addStringOption(opt =>
        opt
          .setName(titleOptions[2].name)
          .setDescription(titleOptions[2].description),
      )

      // "comment" option
      .addStringOption(opt =>
        opt
          .setName(titleOptions[3].name)
          .setDescription(titleOptions[3].description),
      )

      // "image" option
      .addAttachmentOption(opt =>
        opt
          .setName(titleOptions[4].name)
          .setDescription(titleOptions[4].description),
      )

      // "image-url" option
      .addStringOption(opt =>
        opt
          .setName(titleOptions[5].name)
          .setDescription(titleOptions[5].description),
      ),
  )

  // "recruitment" subcommand
  .addSubcommand(sub =>
    sub
      .setName(announcement_recruitment.subName!)
      .setDescription(announcement_recruitment.description),
  );

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case announcement_release.subName:
      await Announcement.release(interaction);
      return;
    case announcement_title.subName:
      await Announcement.title(interaction);
      return;
    // case announcement_recruitment.subName:
    //   await Announcement.recruitment(interaction);
    //   break;
    default:
      return;
  }
}

export const options: CommandOptions = {
  deleted: false,
  devOnly: true,
};
