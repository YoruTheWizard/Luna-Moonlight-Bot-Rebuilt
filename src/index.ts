import dotenv from 'dotenv';
dotenv.config();

import { CommandKit } from 'commandkit';
import { Client, type ClientOptions } from 'discord.js';
import { join } from 'path';
import * as config from './config.json';

const clientOptions: ClientOptions = {
  intents: [
    'Guilds',
    'GuildMessages',
    'GuildMembers',
    'GuildPresences',
    'MessageContent',
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
  client.login(process.env.TOKEN);
};
start();

export default start;
