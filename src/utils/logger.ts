import { consoleFormat as cf } from './consoleFormat';

export abstract class Logger {
  public static log(message: string) {
    console.log(message);
  }

  public static success(message: string) {
    console.log(`${cf.success} ${message}`);
  }

  public static error(type: 'slash' | 'event', name: string, message: unknown) {
    console.error(
      `${cf.b + cf.fr}[!]${cf.fw} Error while ${type === 'slash' ? 'running ' : ''}${name}:${cf.r}\n${message}`,
    );
  }
}
