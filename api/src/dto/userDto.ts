import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsAllowedRole } from 'src/users/role.validator';

export class UserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'This field is required' })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'This field is required' })
  last_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'This field is required' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'This field is required' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,{message:'The password must be longer than 6 characters, a special character, a capital letter, and numbers.'})
  password: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photo: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  suscription: boolean;

  @IsAllowedRole(["Admin", "User", "Creator"], {
    message: `Unidentified Role. Please try again.`,
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string = 'User';
}
