import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  id: false, // id를 생성하지 않는다. (별도의 id를 생성하여 구분 예정)
  collection: 'sockets', // 콜렉션 이름 설정 (지금은 안해도됨)
  timestamps: true, // 생성, 수정 시간 자동 생성
};

@Schema(options)
export class Socket extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}

export const SocketSchema = SchemaFactory.createForClass(Socket);
