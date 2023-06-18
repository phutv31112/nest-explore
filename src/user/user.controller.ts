import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { Role } from '../enum/role.enum';
import { Request } from 'express';
import { UserService } from './user.service';
import { ChangePassDto } from '../dto/change-pass.dto';
import { User } from 'src/decorator/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get('detail')
  getUserDetail(@User() user) {
    console.log('user:', user);
    return user;
  }
  @Roles(Role.Admin)
  @Get('all-users')
  getAllUser() {
    return this.userService.getAllUser();
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Req() req: Request, @Body() body: ChangePassDto) {
    const user = req.user;
    return this.userService.changePassword(user, body);
  }
}
