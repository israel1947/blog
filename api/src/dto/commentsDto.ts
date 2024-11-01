import { IsString, IsNotEmpty, IsDate, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentsDto {

  @ApiProperty()
  @IsNotEmpty({ message: 'post_id field is required' })
  @IsMongoId()
  post_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'author field is required' })
  @IsString()
  author: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'author_photo field is required' })
  @IsString()
  author_photo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'content field is required' })
  @IsString()
  content: string;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty({ message: 'created_at field is required' })
  @IsDate()
  created_at: Date;
}
