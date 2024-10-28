import { SlashCommandBuilder } from 'discord.js';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { getCommandDescription } from '../../json';
import { ErrorLogger } from '../../utils';

const reloadCmd = getCommandDescription('reloadCommands');

export const data = new SlashCommandBuilder()
  .setName(reloadCmd.name)
  .setDescription(reloadCmd.description)

  // "type" option
  .addStringOption(opt =>
    opt
      .setName(reloadCmd.options![0].name)
      .setDescription(reloadCmd.options![0].description)
      .addChoices(
        {
          name: reloadCmd.options![0].choices![0].name,
          value: reloadCmd.options![0].choices![0].value,
        },
        {
          name: reloadCmd.options![0].choices![1].name,
          value: reloadCmd.options![0].choices![1].value,
        },
      )
      .setRequired(false),
  );

export const options: CommandOptions = {
  devOnly: true,
};

export const run = async ({
  interaction,
  handler,
}: SlashCommandProps): Promise<void> => {
  const typeOpt = interaction.options.getString(reloadCmd.options![0].name);

  let resp, respEng;
  let type: 'global' | 'dev' | undefined;
  switch (typeOpt) {
    case 'dev':
      type = 'dev';
      resp = ' de desenvolvedor';
      respEng = 'Developer';
      break;

    case 'global':
      type = 'global';
      resp = ' globais';
      respEng = 'Global';
      break;

    default:
      resp = '';
      respEng = 'All';
  }

  try {
    await interaction.deferReply();
    await handler.reloadCommands(type);

    console.log(`${respEng} commands reloaded.`);
    await interaction.editReply(`Comandos${resp} recarregados.`);
  } catch (err) {
    ErrorLogger.slash('recarregarcomandos', err);
  }
};
