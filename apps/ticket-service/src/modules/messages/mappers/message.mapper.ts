import { Message } from '@ticket-service/generated/prisma';
import { SenderType } from '@shared/contracts/ticket/ticket.enums';
import { MessageResponse } from '@shared/contracts/ticket/message-response.dto';

export class MessageMapper {
  static toResponse(message: Message): MessageResponse {
    return {
      id: message.id,
      ticketId: message.ticketId,
      senderId: message.senderId,
      senderType: message.senderType as unknown as SenderType,
      content: message.content,
      createdAt: message.createdAt,
    };
  }
}
