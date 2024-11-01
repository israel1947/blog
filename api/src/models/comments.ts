import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

export type CommentsDocument = HydratedDocument<Comments>;


@Schema()
export class Comments {
  @ApiProperty()
  @Prop({ required: true })
  post_id: string;

  @ApiProperty()
  @Prop({ required: true })
  author: string;

  @ApiProperty()
  @Prop({ required: true })
  author_photo: string;

  @ApiProperty()
  @Prop({ required: true })
  content: string;

  @ApiProperty()
  @Prop({ required: true })
  created_at: Date;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);