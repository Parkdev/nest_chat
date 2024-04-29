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

  //handleConnection(client: any, ...args: any[]) { // 연결이 되는순간 실행
  // console.log('클라이언트 접속', client.id);
  //}

  afterInit() {
    console.log('소켓 서버가 초기화되었습니다.');
    this.logger.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('클라이언트 접속');
    this.logger.log(`connect : ${socket.id} ${socket.nsp.name}`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('클라이언트 접속 해제');
    this.logger.log(`connect : ${socket.id} ${socket.nsp.name}`);
  }

  //   @SubscribeMessage('new_user') // new_user라는 이벤트를 받았을 때
  //   handleNewUser(
  //     @MessageBody() username: string, // 바디로부터 username을 받아온다.
  //     @ConnectedSocket() socket: Socket, // 이 소캣으로 emit|on 할 수 있다.
  //   ): string {
  //     console.log('소캣id', socket.id); //소캣id zCSBcBveGDK8vRvcAAAB
  //     console.log('유저', username); // 유저 홍길동
  //     // socket.emit('welcome', `환영합니다 ${username}님!`); // welcome 이벤트를 발생시킨다.
  //     return username;
  //   }
  // }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // username db에 적재
    // 이후 브로드캐스팅 적제
    socket.broadcast.emit('user_connected', username); // 연결된 모든 소캣에 데이터를 보냄
    return username;
  }

  @SubscribeMessage('send_message')
  handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('new_chat', {
      chat,
      username: socket.id,
    }); // 연결된 모든 소캣에 데이터를 보냄
  }
}
