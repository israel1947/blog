import { IsString, IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @ApiProperty()
  @IsNotEmpty({ message: 'This field is required' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'This field is required' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  }, {
    message: 'Password must be at least 8 characters long, with at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol.'
  })
  password: string;
}
