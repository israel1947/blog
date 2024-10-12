import { IsString, IsEmail, IsNotEmpty, Validate, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Dto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({message:'This field is required'})
  name:string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({message:'This field is required'})
  last_name:string;

  @ApiProperty()
  @IsNotEmpty({message:'This field is required'})
  @IsEmail({},{message:'Please provide a valid email'})
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({message:'This field is required'})
  @MinLength(6)
  password:string;

  @ApiProperty({required:false})
  @IsString()
  photo:string;
}
