import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDto } from 'src/dto/userDto';
import { User } from 'src/models/user';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(private jwtService: JwtService) { }

  @InjectModel(User.name) private userModel: Model<User>;

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).lean();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUserById(_id: string): Promise<User[] | null> {
    const userData = this.userModel.findById({ _id: _id });
    if (!userData) {
      throw new NotFoundException("Username not found or does not exist");
    }
    return this.userModel.findById({ _id: _id });
  }

  async updateUser(id: string, updateUser: UserDto): Promise<{ access_token: string }> {
    const userId = new Types.ObjectId(id);
    const hassPass = await bcrypt.hash(updateUser.password, 10)
    const userData = await this.userModel.findById(userId);

    if (!userData) {
      throw new NotFoundException("Username not found or does not exist");
    }


    const user = await this.userModel.findOneAndUpdate(
      userId,
      {
        ...updateUser,
        password: hassPass,
      },
      { new: true }
    )

    if (!user) {
      throw new Error("Error updating the user");
    }

    const userPayload = user.toObject();
    const access_token = await this.jwtService.signAsync(userPayload, {secret: process.env.SECRET});

    return { access_token };
  };

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }





}
