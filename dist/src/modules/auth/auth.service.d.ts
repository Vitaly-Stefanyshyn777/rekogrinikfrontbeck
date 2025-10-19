import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { UserService } from "../user/user.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO } from "./auth.dto";
export declare class AuthService {
    private userService;
    private prisma;
    private jwtService;
    constructor(userService: UserService, prisma: PrismaService, jwtService: JwtService);
    login(loginUserDTO: LoginUserDTO): Promise<AuthResponseDTO>;
    register(user: RegisterUserDTO): Promise<User>;
    requestPasswordReset(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
}
