import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/userDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }


  @Get()
  getAllUsers() {
    return this.userService.findAllUsers();
  };


  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Res() resp: Response, @Body() userData: UserDto) {
    try {
      const updatedUser  = await this.userService.updateUser(id, userData);
      resp.send({ ok: true, messge: "User Updated Susscefully!", user: updatedUser  }); 
    } catch (error) {
      resp.status(400).send({ ok: false, message: error.message });
    };
  };


  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() resp: Response) {
    resp.send({ ok: true, messge: "User deleted Susscefully!" });
    return this.userService.removeUser(id);
  };

  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() resp: Response) {
    try {
      const user = await this.userService.findUserById(id);
      resp.send({ ok: true, user: user });
    } catch (error) {
      resp.status(404).send({ ok: false, message: error.message });
    };
  };
}
