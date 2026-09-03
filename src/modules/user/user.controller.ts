import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Param,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/auth.jwt.guard";

import { UserService } from "./user.service";

@ApiTags("users")
@Controller("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<User[]> {
    return this.userService.users({});
  }

  @Post("user")
  @UseGuards(JwtAuthGuard)
  async signupUser(
    @Body()
    userData: {
      name?: string;
      email: string;
      password: string;
      role?: string;
    },
    @Req() req,
  ): Promise<User> {
    if (!req.user?.isSuper) {
      throw new ForbiddenException(
        "Only super admin can create administrators",
      );
    }
    return this.userService.createUser(userData as any);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param("id") id: string, @Req() req): Promise<User> {
    const requester = req.user;
    if (!requester?.isSuper) {
      throw new ForbiddenException(
        "Only super admin can delete administrators",
      );
    }

    return this.userService.deleteUser({ id: Number(id) });
  }
}
