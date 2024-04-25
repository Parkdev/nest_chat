import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chatting' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor() {
    this.logger.log('constructor');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('클라이언트 접속 해제');
    this.logger.log(`connect : ${socket.id} ${socket.nsp.name}`);
  }

  //handleConnection(client: any, ...args: any[]) { // 연결이 되는순간 실행
  // console.log('클라이언트 접속', client.id);
  //}

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('클라이언트 접속');
    this.logger.log(`connect : ${socket.id} ${socket.nsp.name}`);
  }

  afterInit() {
    console.log('소켓 서버가 초기화되었습니다.');
    this.logger.log('init');
  }

  @SubscribeMessage('new_user') // new_user라는 이벤트를 받았을 때
  handleNewUser(
    @MessageBody() username: string, // 바디로부터 username을 받아온다.
    @ConnectedSocket() socket: Socket, // 이 소캣으로 emit|on 할 수 있다.
  ): string {
    console.log('소캣id', socket.id); //소캣id zCSBcBveGDK8vRvcAAAB
    console.log('유저', username); // 유저 ㅁㄴㅇㄹ
    socket.emit('welcome', `환영합니다 ${username}님!`); // welcome 이벤트를 발생시킨다.
    return 'Hello world!';
  }
}
