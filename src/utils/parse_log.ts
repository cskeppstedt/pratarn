import fs from 'fs';
import path from 'path';
import readline from 'readline';

const RE_EVT = /^{"message":"\[bot\] message event - .* - evt: (.*)","level":"verbose"}$/;
const RE_ESCAPED_QUOTES = /\\"/g;

export const parseMessageEvents = () => {
  const logPath = path.join(__dirname, '..', 'logs', 'pratarn.log');

  return new Promise((resolve) => {
    const messageEvents: IMessageEvent[] = [];
    const lineReader = readline.createInterface({
      input: fs.createReadStream(logPath),
    });
    lineReader.on('line', (line) => {
      const matches = RE_EVT.exec(line);
      if (matches && matches.length === 2) {
        const evtContent = matches[1].replace(RE_ESCAPED_QUOTES, '"');

        console.info('--evt', evtContent);
        const evt: IMessageEvent = JSON.parse(evtContent);
        messageEvents.push(evt);
      }
    });

    lineReader.on('close', () => {
      resolve(messageEvents);
    });
  }) as Promise<IMessageEvent[]>;
};
