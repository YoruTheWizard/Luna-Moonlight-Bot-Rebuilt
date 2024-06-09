import type { CommandOptions, SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';

import { commandDescriptions } from '../../json';
import { CommandOptionChoiceFormat } from '../../types';
import { announcementFunctions, setCommandTitleOption } from '../../utils';
const {
  announcement,
  announcement_release,
  announcement_title,
  announcement_recruitment,
} = commandDescriptions;

type ReleaseTypeOption = {
  name: string;
  description: string;
  choices: CommandOptionChoiceFormat[];
};

const releaseTypeOptionChoices = announcement_release
  .options[0] as unknown as ReleaseTypeOption;

export const data = new SlashCommandBuilder()
  .setName(announcement.name)
  .setDescription(announcement.description)

  // "release" subcommand
  .addSubcommand(sub =>
    sub
      .setName(announcement_release.subName)
      .setDescription(announcement_release.description)

      // "title" option
      .addStringOption(opt => setCommandTitleOption(opt))

      // "type" option
      .addStringOption(opt =>
        opt
          .setName(announcement_release.options[0].name)
          .setDescription(announcement_release.options[0].description)
          .addChoices(
            {
              name: releaseTypeOptionChoices.choices[0].name,
              value: releaseTypeOptionChoices.choices[0].value,
            },
            {
              name: releaseTypeOptionChoices.choices[1].name,
              value: releaseTypeOptionChoices.choices[1].value,
            },
          )
          .setRequired(true),
      )

      // "numbers" option
      .addStringOption(opt =>
        opt
          .setName(announcement_release.options[1].name)
          .setDescription(announcement_release.options[1].description)
          .setRequired(true),
      )

      // "links" option
      .addStringOption(opt =>
        opt
          .setName(announcement_release.options[2].name)
          .setDescription(announcement_release.options[2].description)
          .setRequired(true),
      )

      // "volume" option
      .addNumberOption(opt =>
        opt
          .setName(announcement_release.options[3].name)
          .setDescription(announcement_release.options[3].description),
      )

      // "description" option
      .addStringOption(opt =>
        opt
          .setName(announcement_release.options[4].name)
          .setDescription(announcement_release.options[4].description),
      )

      // "image" option
      .addAttachmentOption(opt =>
        opt
          .setName(announcement_release.options[5].name)
          .setDescription(announcement_release.options[5].description),
      )

      // "image-url" option
      .addStringOption(opt =>
        opt
          .setName(announcement_release.options[6].name)
          .setDescription(announcement_release.options[6].description),
      ),
  )

  // "title" subcommand
  .addSubcommand(sub =>
    sub
      .setName(announcement_title.subName)
      .setDescription(announcement_title.description)

      // "name" option
      .addStringOption(opt =>
        opt
          .setName(announcement_title.options[0].name)
          .setDescription(announcement_title.options[0].description)
          .setRequired(true),
      )

      // "lnks" option
      .addStringOption(opt =>
        opt
          .setName(announcement_title.options[1].name)
          .setDescription(announcement_title.options[1].description)
          .setRequired(true),
      )

      // "sinopsys" option
      .addStringOption(opt =>
        opt
          .setName(announcement_title.options[2].name)
          .setDescription(announcement_title.options[2].description),
      )

      // "comment" option
      .addStringOption(opt =>
        opt
          .setName(announcement_title.options[3].name)
          .setDescription(announcement_title.options[3].description),
      )

      // "image" option
      .addAttachmentOption(opt =>
        opt
          .setName(announcement_title.options[4].name)
          .setDescription(announcement_title.options[4].description),
      )

      // "image-url" option
      .addStringOption(opt =>
        opt
          .setName(announcement_title.options[5].name)
          .setDescription(announcement_title.options[5].description),
      ),
  )

  // "recruitment" subcommand
  .addSubcommand(sub =>
    sub
      .setName(announcement_recruitment.subName)
      .setDescription(announcement_recruitment.description),
  );

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case announcement_release.subName:
      await announcementFunctions.release(interaction);
      return;
    case announcement_title.subName:
      await announcementFunctions.title(interaction);
      return;
    case announcement_recruitment.subName:
      await announcementFunctions.release(interaction);
  }
}

export const options: CommandOptions = {
  deleted: false,
  devOnly: true,
};
