import { SenderType } from './ticket.enums';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;

  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @IsEnum(SenderType)
  senderType: SenderType;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content: string;
}
