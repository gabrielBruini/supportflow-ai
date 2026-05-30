import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SenderType } from '@shared/contracts/ticket/ticket.enums';
import { ListTicketsDto } from '@shared/contracts/ticket/list-tickets.dto';
import { UpdateTicketStatusDto } from '@shared/contracts/ticket/update-ticket-status.dto';
import { TicketsService } from './tickets.service';
import { TicketsGateway } from '../websocket/tickets.gateway';

@ApiTags('tickets')
@ApiBearerAuth()
@Controller({ path: 'tickets', version: '1' })
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly ticketsGateway: TicketsGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created' })
  async create(
    @Body() body: { title: string; description: string; priority?: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.ticketsService.create({
      title: body.title,
      description: body.description,
      customerId: req.user.sub,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List tickets with optional filters' })
  async list(
    @Query() query: ListTicketsDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.ticketsService.list({ ...query, customerId: req.user.sub });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  async getById(@Param('id') id: string) {
    return this.ticketsService.getById({ id });
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update ticket status' })
  async updateStatus(
    @Param('id') ticketId: string,
    @Body() body: Pick<UpdateTicketStatusDto, 'status'>,
    @Request() req: { user: { sub: string } },
  ) {
    const updated = await this.ticketsService.updateStatus({
      ticketId,
      status: body.status,
      updatedBy: req.user.sub,
    });
    this.ticketsGateway.emitTicketUpdated(updated);
    return updated;
  }

  @Get(':id/conversation')
  @ApiOperation({ summary: 'Get full conversation for a ticket' })
  async getConversation(@Param('id') ticketId: string) {
    return this.ticketsService.getConversation({ ticketId });
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a message to a ticket' })
  async addMessage(
    @Param('id') ticketId: string,
    @Body() body: { content: string },
    @Request() req: { user: { sub: string } },
  ) {
    const message = await this.ticketsService.addMessage({
      ticketId,
      senderId: req.user.sub,
      senderType: SenderType.AGENT,
      content: body.content,
    });
    this.ticketsGateway.emitNewMessage(ticketId, message);
    return message;
  }
}
