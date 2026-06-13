import { WebSocketGateway, WebSocketServer, OnGatewayInit, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type { Redis } from 'ioredis';
import { Logger, OnModuleInit } from '@nestjs/common';
import { LOG_CHANNEL } from './logs.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/logs' })
export class LogsGateway implements OnGatewayInit, OnModuleInit {
  @WebSocketServer()
  private server!: Server;

  private readonly logger = new Logger(LogsGateway.name);
  private subscriber!: Redis;

  constructor(@InjectRedis() private readonly redis: Redis) {}

  afterInit() { this.logger.log('WebSocket /logs gateway initialized'); }

  onModuleInit() {
    this.subscriber = this.redis.duplicate();
    this.subscriber.subscribe(LOG_CHANNEL, (err) => {
      if (err) this.logger.error('Redis subscribe error', err);
    });
    this.subscriber.on('message', (_channel: string, message: string) => {
      this.server.emit('tool-call', JSON.parse(message) as unknown);
    });
  }

  @SubscribeMessage('subscribe-server')
  handleSubscribe(@MessageBody() data: { serverId: string }, @ConnectedSocket() client: Socket) {
    void client.join(`server:${data.serverId}`);
    return { event: 'subscribed', data: data.serverId };
  }
}
