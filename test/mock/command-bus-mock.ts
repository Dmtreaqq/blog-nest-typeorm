/* eslint-disable */

export class CommandBusMock {
  async execute(command: any) {
    console.log('Command was executed ' + command);
    return {};
  }
}
