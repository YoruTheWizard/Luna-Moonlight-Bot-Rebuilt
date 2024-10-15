import fs from 'fs';
import path from 'path';

// JSON
import * as commandDescriptionsJson from './files/commandDescriptions.json';
import customNicksJson from './files/internal/customNicks.json';
import scanTitlesJson from './files/internal/scanTitles.json';
import adjectivesJson from './files/internal/adjectives.json';
import * as emojisJson from './files/internal/emojis.json';
import * as messagesJson from './files/messages.json';
import * as scanBloopersJson from './files/internal/scanBloopers.json';

// TYPES
import type {
  addToJsonFN,
  Adjective,
  CommandDataDescription,
  CommandDescriptionsJsonType,
  CustomNicknameUser,
  Emoji,
  ScanBlooper,
  ScanBloopersJsonType,
  ScanTitle,
} from '../types';

type CommandName = keyof typeof commandDescriptionsJson;
type MessageName = keyof typeof messagesJson;
type EmojiName = keyof typeof emojisJson;

type CommandDescFn = (command: CommandName) => CommandDataDescription;
type MessageFn = <K extends MessageName>(
  message: K,
) => (typeof messagesJson)[K];

// CONSTS
const commandDescriptions =
  commandDescriptionsJson as unknown as CommandDescriptionsJsonType;

const scanBloopers = scanBloopersJson as ScanBloopersJsonType;
const adjectives = adjectivesJson as Adjective[];

export const scanTitles = scanTitlesJson as ScanTitle[];
export const customNicks = customNicksJson as CustomNicknameUser[];
export const messages = messagesJson;
export const emojis = emojisJson as { [key: string]: Emoji };

// FUNCTIONS
export const getCommandDescription: CommandDescFn = command =>
  commandDescriptions[command];

export const getMessage: MessageFn = message => messagesJson[message];

export const getEmoji = (emoji: EmojiName): Emoji => emojisJson[emoji] as Emoji;

export const getEmojiArray = (): ({ name: string } & Emoji)[] => {
  const array = [];
  for (const [name, value] of Object.entries(emojis)) {
    if (name === 'default') continue;
    array.push({ name, ...value });
  }
  return array;
};

export const addToJson: addToJsonFN = (file, data) => {
  const filePath = path.resolve(__dirname, 'files', 'internal', `${file}.json`);
  const jsonFile = JSON.parse(
    fs.readFileSync(filePath).toString(),
  ) as (typeof data)[];
  jsonFile.push(data);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getBlooperAuthors = () => scanBloopers.authors;

export const getRandomBlooper = (author?: string): ScanBlooper | null => {
  if (author && !scanBloopers.authors.includes(author)) return null;
  let blooper;
  do {
    const rand = Math.round(Math.random() * scanBloopers.bloopers.length);
    blooper = scanBloopers.bloopers[rand];
  } while (author && blooper.author !== author);
  return blooper;
};

export const getRandomAdjective = (good?: boolean): Adjective => {
  let adj;
  do {
    const rand = Math.floor(Math.random() * adjectives.length);
    adj = adjectives[rand];
  } while (good && adj.bad);
  return adj;
};

export const getNickname = (userId: string): CustomNicknameUser | null => {
  for (const obj of customNicks) {
    if (Array.isArray(obj.id)) {
      if (obj.id.includes(userId)) return obj;
    } else if (obj.id === userId) return obj;
  }
  return null;
};
