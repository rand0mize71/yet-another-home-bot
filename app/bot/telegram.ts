import {IBot, IInputMessage, BotType} from './interfaces';
import * as Telegram from 'node-telegram-bot-api';
import {DefaultBot} from './default';
// TODO: catching errors
export class TelegramBot extends DefaultBot implements IBot {
    constructor(apiKey: string) {
        super();
        this.api = new Telegram(apiKey, {polling: true});
        this.type = BotType.TELEGRAM;
    }

    public listen(fn: (message: any) => void): void {
        this.api.on('message', (msg) => {
            fn(this.processMessage(msg));
        });
    }

    public reply(msg: IInputMessage, replyMessage: string): Promise<IInputMessage> {
        return this.api.sendMessage(msg.senderId, replyMessage)
            .then((msg: any) => {
                return this.processMessage(msg);
            });
    }

    public send(userId: string | number, message: string): Promise<IInputMessage> {
        return this.api.sendMessage(userId, message)
            .then((msg: any) => {
                return this.processMessage(msg);
            });
    }

    public processMessage(msg: any): IInputMessage {
        const message: IInputMessage = {
            senderId: msg.from.id,
            text: this.parseText(msg.text)
        };

        return message;
    }
}