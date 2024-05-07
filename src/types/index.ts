import {
  APIActionRowComponent,
  APIButtonComponent,
  EmbedBuilder,
  Role,
} from 'discord.js';

export type ScanTitle = {
  id: string;
  name: string;
  longNameJP?: string;
  longNameEN?: string;
  longNamePT?: string;
  color: string;
  emoji: string;
  fanRole: string;
};

export type CommandOptionChoiceFormat = {
  name: string;
  value: string;
};

export type EmbedFunctionOptions = {
  role?: Role | '@deleted-role' | '@everyone';
  embeds: EmbedBuilder[];
  rows?: APIActionRowComponent<APIButtonComponent>[];
  ephemeral: boolean;
};

export type ContentLinkObject = {
  num: number;
  name: string;
  url: string;
  emoji?: string;
};

export type CustomNicknameUser = {
  id: string | string[];
  nickname: string;
  polite?: true;
};

export type addToJsonFN = {
  (file: 'scanTitles', data: ScanTitle): void | never;
  (file: 'customNicks', data: CustomNicknameUser): void | never;
};
