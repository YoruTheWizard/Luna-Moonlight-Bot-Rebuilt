import { SlashCommandBuilder } from 'discord.js';
import { getCommandDescription } from '../../json';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { Activity } from '../../utils';

const activity = getCommandDescription('activity');
const activitySet = getCommandDescription('activity_set');
const activityClear = getCommandDescription('activity_clear');

export const data = new SlashCommandBuilder()
  .setName(activity.name)
  .setDescription(activity.description)

  // "set" subcommand
  .addSubcommand(sub =>
    sub
      .setName(activitySet.subName!)
      .setDescription(activitySet.description)

      // "type" option
      .addStringOption(opt =>
        opt
          .setName(activitySet.options![0].name)
          .setDescription(activitySet.options![0].description)
          .addChoices(...activitySet.options![0].choices!)
          .setRequired(true),
      )

      // "text" option
      .addStringOption(opt =>
        opt
          .setName(activitySet.options![1].name)
          .setDescription(activitySet.options![1].description)
          .setRequired(true),
      ),
  )

  // "clear" subcommand
  .addSubcommand(sub =>
    sub
      .setName(activityClear.subName!)
      .setDescription(activityClear.description),
  );

export const options: CommandOptions = {
  devOnly: true,
  awakeOnly: true,
};

export const run = async ({
  interaction,
  client,
}: SlashCommandProps): Promise<void> => {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case activitySet.subName:
      await Activity.set(interaction, client);
      break;
    case activityClear.subName:
      await Activity.clear(interaction, client);
      break;
  }
};
