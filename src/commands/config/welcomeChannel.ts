import { CommandOptions, SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';
import { getCommandDescription } from '../../json';

const welcome = getCommandDescription('welcomechannel');
const welcomeConfig = getCommandDescription('welcomechannel_configure');
const welcomeDisable = getCommandDescription('welcomechannel_disable');
const welcomeInfo = getCommandDescription('welcomechannel_info');

export const data = new SlashCommandBuilder()
  .setName(welcome.name)
  .setDescription(welcome.description)

  // "config" subcommand
  .addSubcommand(sub =>
    sub
      .setName(welcomeConfig.subName!)
      .setDescription(welcomeConfig.description)

      // "channel" option
      .addChannelOption(opt =>
        opt
          .setName(welcomeConfig.options![0].name)
          .setDescription(welcomeConfig.options![0].description)
          .setRequired(true),
      ),
  )

  // "disable" subcommand
  .addSubcommand(sub =>
    sub
      .setName(welcomeDisable.subName!)
      .setDescription(welcomeDisable.description),
  )

  // "info" subcommand
  .addSubcommand(sub =>
    sub.setName(welcomeInfo.subName!).setDescription(welcomeInfo.description),
  );

export const options: CommandOptions = {
  userPermissions: ['Administrator'],
  botPermissions: ['Administrator'],
};

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  interaction.reply('Hello');
}
