import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { consoleFormat as cf } from './consoleFormat';
import { getCurrentDate } from './content';

export abstract class Logger {
  private static OUTPUT = createWriteStream(
    resolve(__dirname, '..', '..', 'logs', 'output.log'),
    { flags: 'a' },
  );
  private static ERROR = createWriteStream(
    resolve(__dirname, '..', '..', 'logs', 'error.log'),
    { flags: 'a' },
  );

  private static getTime(f: boolean = true): string {
    const date = getCurrentDate();
    return `${f ? cf.b : ''}[${date.toLocaleString()}]${f ? cf.r : ''}`;
  }

  public static log(message: string, sendTime: boolean = false) {
    console.log(`${sendTime ? Logger.getTime() + ' ' : ''}${message}`);
  }

  public static success(message: string) {
    Logger.OUTPUT.write(`\n${Logger.getTime(false)} ${message}`);
    console.log(`\n${Logger.getTime()} ${cf.success} ${message}`);
  }

  public static error(type: 'slash' | 'event', name: string, message: unknown) {
    Logger.ERROR.write(
      `\n${Logger.getTime(false)} Error while ${type === 'slash' ? 'running ' : ''}${name}: \n${message}`,
    );
    console.error(
      `\n${Logger.getTime()} ${cf.error} ${cf.b}Error while ${type === 'slash' ? 'running ' : ''}${name}:${cf.r}\n${message}`,
    );
  }
}
