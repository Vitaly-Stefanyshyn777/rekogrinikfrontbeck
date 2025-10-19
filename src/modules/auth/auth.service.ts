import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { randomBytes } from "crypto";

import { UserService } from "../user/user.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthHelpers } from "../../shared/helpers/auth.helpers";
import { GLOBAL_CONFIG } from "../../configs/global.config";

import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  public async login(loginUserDTO: LoginUserDTO): Promise<AuthResponseDTO> {
    const userData = await this.userService.findUser({
      email: loginUserDTO.email,
    });

    if (!userData) {
      throw new UnauthorizedException();
    }

    const isMatch = await AuthHelpers.verify(
      loginUserDTO.password,
      userData.password
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: null,
      // role: userData.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    return {
      user: payload,
      accessToken: accessToken,
    };
  }
  public async register(user: RegisterUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }

  public async requestPasswordReset(
    email: string
  ): Promise<{ success: boolean }> {
    const user = await this.userService.findUser({ email });
    if (!user) {
      // Avoid user enumeration
      return { success: true };
    }
    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });
    // Here you would send email with token link
    return { success: true };
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!record || record.used || record.expiresAt < new Date()) {
      throw new BadRequestException("Invalid or expired token");
    }
    const hashed = (await AuthHelpers.hash(newPassword)) as string;
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });
    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });
    return { success: true };
  }
}
