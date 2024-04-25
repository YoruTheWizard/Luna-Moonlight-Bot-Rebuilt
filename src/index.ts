import dotenv from 'dotenv';
dotenv.config();

import { CommandKit } from 'commandkit';
import { Client, type ClientOptions, IntentsBitField } from 'discord.js';
import { join } from 'path';
import * as config from './config.json';

const clientOptions: ClientOptions = {
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
  allowedMentions: {
    parse: ['everyone', 'users', 'roles'],
    repliedUser: true,
  },
};

const commandkitConfig = {
  devGuildIds: [config.testServer],
  devUserIds: config.devs,
  commandsPath: join(__dirname, 'commands'),
  eventsPath: join(__dirname, 'events'),
  validationsPath: join(__dirname, 'validations'),
  // bulkRegister: true,
};

const start = () => {
  const client = new Client(clientOptions);
  new CommandKit({
    client,
    ...commandkitConfig,
  });
};
start();

export default start;
