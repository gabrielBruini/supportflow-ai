import { TicketStatus } from './ticket.enums';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateTicketStatusDto {
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;

  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsUUID()
  @IsOptional()
  updatedBy?: string;
}
