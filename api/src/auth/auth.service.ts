import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/dto/userDto';
import { User } from 'src/models/user';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly saltOrRounds: number = 10;

  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  @InjectModel(User.name) private userModel: Model<User>;

  async createUser(createUserDto: UserDto): Promise<{ access_token: string }> {
    const possibleUser = await this.userModel.findOne({ email: createUserDto.email });
    if (possibleUser) {
      throw new ConflictException("This email is already in use.");
    }
    const hassPass = await bcrypt.hash(createUserDto.password, this.saltOrRounds)
    const createUser = new this.userModel({
      ...createUserDto,
      password: hassPass
    });
    const user = await createUser.save();

    //jwt
    const { password, ...userWithoutPassword } = user.toObject();
    const payload = { ...userWithoutPassword };

    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.SECRET }),
    }

  }

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user || !user.password) {
      throw new ConflictException("User not found or password is missing");
    }
    const isMatch = await bcrypt.compare(pass, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException("Incorrect Credentials **");
    }
    const { password, ...result } = user;
    return {
      access_token: await this.jwtService.signAsync(result, { secret: process.env.SECRET }),
    }
  }
}
