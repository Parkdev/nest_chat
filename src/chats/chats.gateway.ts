import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';
import { Model } from 'mongoose';

@WebSocketGateway({ namespace: 'chatting' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    // 모델(스키마) 의존성 주입
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
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

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('클라이언트 접속 해제');
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('user_disconnected', user.username);
      await user.deleteOne();
      console.log('유저 삭제');
    }
    this.logger.log(`disconnect : ${socket.id} ${socket.nsp.name}`);
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
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // username db에 적재
    // 유저가 이미 등록되어있는지 확인
    const exist = await this.socketModel.exists({ username: username });
    const count = await this.socketModel.countDocuments();
    if (exist) {
      // 0과 1 사이 랜덤한 실수 생성 후 100 곱, 소수점 삭제
      // 더 많은 유저가 들어온다고 가정한다면 uuid를 사용하면된다.
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }

    // 이후 브로드캐스팅 적제
    socket.broadcast.emit('user_connected', { count, username }); // 연결된 모든 소캣에 데이터를 보냄
    return { username, count };
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });
    console.log('유저찾음', socketObj);

    await this.chattingModel.create({
      user: socketObj,
      chat: chat,
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObj.username,
    }); // 연결된 모든 소캣에 데이터를 보냄
  }
}
