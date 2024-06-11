export function errorLogger(commandName: string, err: unknown) {
  console.error(`Error while running command "${commandName}":\n${err}`);
  return;
}
