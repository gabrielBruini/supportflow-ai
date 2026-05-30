import { SenderType } from './ticket.enums';

export interface MessageResponse {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: SenderType;
  content: string;
  createdAt: Date;
}
