export abstract class ErrorLogger {
  public static slash(commandName: string, err: unknown) {
    console.error(`Error while running command "${commandName}":\n${err}`);
    return;
  }

  public static event(event: string, err: unknown) {
    console.error(`Error while ${event}:\n${err}`);
    return;
  }
}
