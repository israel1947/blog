import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";
import slugify from "slugify";

export type PostsDocument = HydratedDocument<Posts>;


@Schema()
export class Posts {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  images: string[];

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  tags: string[];

  @ApiProperty()
  @Prop({ required: true, defaul: new Date()})
  created_at: Date;

  @ApiProperty()
  @Prop({ required: true })
  last_read_at: string;


  @ApiProperty()
  @Prop()
  comments: number;

  @ApiProperty()
  @Prop()
  likes: number;

  @ApiProperty()
  @Prop()
  views: number;

  @ApiProperty()
  @Prop({ required: true })
  category: string;

  @ApiProperty()
  @Prop({ required: true })
  user_id: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  friendlyId: string;
}

export const PostSchema = SchemaFactory.createForClass(Posts);

PostSchema.pre<Posts & Document>('save', function () {
  this.friendlyId = slugify(this.title, { lower: true });
});