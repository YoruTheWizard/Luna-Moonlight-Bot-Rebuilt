import { addToJsonFN, CustomNicknameUser, ScanTitle } from '../types';
import * as commandDescriptionsJson from './files/commandDescriptions.json';
import customNicksJson from './files/internal/customNicks.json';
import scanTitlesJson from './files/internal/scanTitles.json';
import * as messagesJson from './files/messages.json';

export const commandDescriptions = commandDescriptionsJson;
export const messages = messagesJson;
export const scanTitles = scanTitlesJson as ScanTitle[];
export const customNicks = customNicksJson as CustomNicknameUser[];

export const addToJson: addToJsonFN = (file, data) => {
  // eslint-disable-next-line
  const jsonFile = require(`./files/private/${file}.json`) as (typeof data)[];
  jsonFile.push(data);
};
