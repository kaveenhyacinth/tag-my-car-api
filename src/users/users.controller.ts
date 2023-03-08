import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  Session,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.singup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  // Custom interceptors can be also used in handler level
  // @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  @Get()
  findAllUsersByEmail(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
