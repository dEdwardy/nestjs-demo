import { MessageType } from "./enums/message.enum";

export interface Message {
  from: string;
  to: string;
  message: string;
  date: Date;
  type: MessageType;
  unread: Boolean;
}