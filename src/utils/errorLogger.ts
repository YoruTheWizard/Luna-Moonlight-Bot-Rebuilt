import { consoleFormat as cf } from './consoleFormat';

export abstract class ErrorLogger {
  public static slash(commandName: string, err: unknown) {
    console.error(
      `${cf.b}[!] Error while running command "${commandName}":${cf.r}\n${err}`,
    );
    return;
  }

  public static event(event: string, err: unknown) {
    console.error(
      `${cf.b + cf.fr}[!]${cf.fw} Error while ${event}:${cf.r}\n${err}`,
    );
    return;
  }
}
