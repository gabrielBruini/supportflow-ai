import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTicketDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
