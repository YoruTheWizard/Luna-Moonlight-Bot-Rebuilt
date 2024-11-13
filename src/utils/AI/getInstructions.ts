import { readFileSync } from 'fs';
import { resolve } from 'path';

export default function getInstructions() {
  const filePath = resolve(
    __dirname,
    '..',
    '..',
    'json',
    'files',
    'internal',
    'AIInstructions.txt',
  );
  const data = readFileSync(filePath, { encoding: 'utf-8' });
  return data;
}
