import fs from 'fs';
import { resolve } from 'path';

import * as config from '../../config.json';

type UpdateConfigFn = <T extends keyof typeof config>(
  key: T,
  data: (typeof config)[T],
) => Promise<void>;

export const updateConfig: UpdateConfigFn = async (key, data) => {
  const filePath = resolve(__dirname, '..', '..', 'config.json');
  const configObj = JSON.parse(
    fs.readFileSync(filePath, { encoding: 'utf-8' }),
  ) as typeof config;
  configObj[key] = data;
  fs.writeFileSync(filePath, JSON.stringify(configObj, null, 2));
};
