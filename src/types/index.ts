import {
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  Role,
} from 'discord.js';

export type ScanTitle = {
  id: string;
  name: string;
  fullNameJP?: string;
  fullNameEN?: string;
  fullNamePT?: string;
  color: string;
  emoji: string;
  fanRole: string;
};

export type EmbedFunctionOptions = {
  role?: Role | '@deleted-role' | '@everyone';
  embeds: APIEmbed[];
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

export type ScanBlooper = {
  message: string;
  author: string;
  alias: string;
  date: string | null;
};

export type ScanBloopersJsonType = {
  authors: string[];
  bloopers: ScanBlooper[];
};

export type CommandDataDescription = {
  name: string;
  subName?: string;
  description: string;
  category: string;
  restriction?: 'owner' | 'dev' | 'admin' | 'staff';
  subcommands?: string[];
  options?: {
    name: string;
    description: string;
    type: string;
    choices?: {
      name: string;
      value: string;
    }[];
    required: boolean;
  }[];
};

export type CommandDescriptionsJsonType = {
  [key: string]: CommandDataDescription;
};

export type addToJsonFN = {
  (file: 'scanTitles', data: ScanTitle): void | never;
  (file: 'customNicks', data: CustomNicknameUser): void | never;
};
