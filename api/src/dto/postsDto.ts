import { IsString, IsNotEmpty, IsDate, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'The title is required' })
  title: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty({ message: 'The img field is required' })
  images: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'One description  is required' })
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Tags field is required' })
  tags: string[];

  @IsOptional()
  @ApiProperty({ example: new Date() })
  @IsDate()
  @IsNotEmpty({ message: 'created_at field is required' })
  created_at: Date = new Date(); 

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'last_read_at field is required' })
  last_read_at: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'category field is required' })
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'user_id field is required' })
  user_id: string;

}