import fs from 'fs';
import path from 'path';

import {
  addToJsonFN,
  CommandDataDescription,
  CommandDescriptionsJsonType,
  CustomNicknameUser,
  ScanTitle,
} from '../types';
import * as commandDescriptionsJson from './files/commandDescriptions.json';
import customNicksJson from './files/internal/customNicks.json';
import scanTitlesJson from './files/internal/scanTitles.json';
import * as emojisJson from './files/internal/emojis.json';
import * as messagesJson from './files/messages.json';

export const messages = messagesJson;
export const emojis = emojisJson;
export const scanTitles = scanTitlesJson as ScanTitle[];
export const customNicks = customNicksJson as CustomNicknameUser[];

type CommandName = keyof typeof commandDescriptionsJson;
type EmojiName = keyof typeof emojisJson;
const commandDescriptions =
  commandDescriptionsJson as unknown as CommandDescriptionsJsonType;

export const getCommandDescription = (
  command: CommandName,
): CommandDataDescription => {
  return commandDescriptions[command];
};

export const getEmoji = (emoji: EmojiName): string => {
  return emojisJson[emoji];
};

export const addToJson: addToJsonFN = (file, data) => {
  const filePath = path.resolve(__dirname, 'files', 'internal', `${file}.json`);
  const jsonFile = JSON.parse(
    fs.readFileSync(filePath).toString(),
  ) as (typeof data)[];
  jsonFile.push(data);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
