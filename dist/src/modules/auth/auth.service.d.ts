import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO } from "./auth.dto";
export declare class AuthService {
    private userService;
    private prisma;
    private jwtService;
    private mailService;
    constructor(userService: UserService, prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    login(loginUserDTO: LoginUserDTO): Promise<AuthResponseDTO>;
    register(user: RegisterUserDTO): Promise<User>;
    requestPasswordReset(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<{
        success: boolean;
    }>;
}
