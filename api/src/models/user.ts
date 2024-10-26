import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{
  @ApiProperty()
  @Prop({required:true})
  name:string;

  @ApiProperty()
  @Prop({required:true})
  last_name:string;

  @ApiProperty()
  @Prop({required:true, index:true, unique:true})
  email:string;

  @ApiProperty()
  @Prop({required:true})
  password:string;

  @ApiProperty({required:false})
  @Prop({required:false})
  photo:string;

  @ApiProperty({required:false})
  @Prop({required:false, default: false})
  suscription:boolean;

  @ApiProperty({required:false})
  @Prop({required:false, default: 'User'})
  role:string;
}

export const UserSchema = SchemaFactory.createForClass(User);