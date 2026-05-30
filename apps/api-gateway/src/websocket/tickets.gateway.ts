/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { MessageResponse } from '@shared/contracts/ticket/message-response.dto';
import { TicketResponse } from '@shared/contracts/ticket/ticket-response.dto';

@WebSocketGateway({ namespace: '/ws', cors: { origin: '*' } })
export class TicketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(TicketsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket): void {
    const token =
      (client.handshake.auth as Record<string, string>)?.token ??
      client.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        token,
      );
      client.data.user = payload;
      this.logger.log(
        `WS connected: socketId=${client.id} userId=${payload.sub}`,
      );
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`WS disconnected: socketId=${client.id}`);
  }

  @SubscribeMessage('join:ticket')
  handleJoinTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() ticketId: string,
  ): void {
    void client.join(`ticket:${ticketId}`);
    this.logger.debug(`${client.id} joined room ticket:${ticketId}`);
  }

  @SubscribeMessage('leave:ticket')
  handleLeaveTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() ticketId: string,
  ): void {
    void client.leave(`ticket:${ticketId}`);
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() ticketId: string,
  ): void {
    client.to(`ticket:${ticketId}`).emit('typing:start', {
      userId: (client.data.user as { sub: string })?.sub,
      ticketId,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() ticketId: string,
  ): void {
    client.to(`ticket:${ticketId}`).emit('typing:stop', {
      userId: (client.data.user as { sub: string })?.sub,
      ticketId,
    });
  }

  emitNewMessage(ticketId: string, message: MessageResponse): void {
    this.server.to(`ticket:${ticketId}`).emit('message:new', message);
  }

  emitTicketUpdated(ticket: TicketResponse): void {
    this.server.to(`ticket:${ticket.id}`).emit('ticket:updated', ticket);
  }
}
