import { writeFileSync } from 'fs';
import { resolve } from 'path';

import * as config from '../config.json';

type UpdateConfigFn = <T extends keyof typeof config>(
  key: T,
  data: (typeof config)[T],
) => void;

export const updateConfig: UpdateConfigFn = (key, data) => {
  const newConfig = { ...config };
  newConfig[key] = data;
  writeFileSync(
    resolve(__dirname, '..', 'config.json'),
    JSON.stringify(newConfig, null, 2),
  );
};
