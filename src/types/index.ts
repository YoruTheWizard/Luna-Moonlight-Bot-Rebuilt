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

export type CustomNicknameUser = {
  id: string | string[];
  nickname: string;
  polite?: true;
};

export type addToJsonFN = {
  (file: 'scanTitles', data: ScanTitle): void | never;
  (file: 'customNicks', data: CustomNicknameUser): void | never;
};
