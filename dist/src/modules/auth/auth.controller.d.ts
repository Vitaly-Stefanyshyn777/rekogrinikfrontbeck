import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO, RequestPasswordResetDTO, ResetPasswordDTO } from "./auth.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: LoginUserDTO, res: any): Promise<AuthResponseDTO>;
    register(user: RegisterUserDTO): Promise<User>;
    logout(res: any): void;
    requestPasswordReset(dto: RequestPasswordResetDTO): Promise<{
        success: boolean;
    }>;
    resetPassword(dto: ResetPasswordDTO): Promise<{
        success: boolean;
    }>;
}
