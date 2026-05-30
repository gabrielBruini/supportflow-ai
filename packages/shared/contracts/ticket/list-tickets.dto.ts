import { TicketPriority, TicketStatus } from './ticket.enums';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class ListTicketsDto {
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  page!: number;

  @IsInt()
  @Min(1)
  @Max(25)
  @IsNotEmpty()
  @Type(() => Number)
  limit!: number;
}
