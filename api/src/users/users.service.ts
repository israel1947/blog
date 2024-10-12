import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Dto } from 'src/dto/dto';
import { User } from 'src/models/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
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

  async updateUser(id: string, updateUser: Dto): Promise<User[] | null> {
    const userId = new Types.ObjectId(id);
    const hassPass = await bcrypt.hash(updateUser.password, 10)
    const userData = await this.userModel.findById(userId);
    if (!userData) {
      throw new NotFoundException("Username not found or does not exist");
    }
    const updateUser2 = {
      ...updateUser,
      password:hassPass,
    }
    return this.userModel.findOneAndUpdate(userId,updateUser2,{new:true});
  };

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }





}
