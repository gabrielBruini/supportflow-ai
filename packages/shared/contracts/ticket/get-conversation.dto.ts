import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetConversationDto {
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;
}
