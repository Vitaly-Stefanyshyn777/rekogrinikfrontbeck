import { AuthService } from "./auth.service";
import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO, RequestPasswordResetDTO, ResetPasswordDTO, ResetPasswordWithCodeDTO } from "./auth.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: LoginUserDTO, res: any): Promise<AuthResponseDTO>;
    register(user: RegisterUserDTO): Promise<any>;
    logout(res: any): void;
    requestPasswordReset(dto: RequestPasswordResetDTO): Promise<{
        success: boolean;
    }>;
    resetPassword(dto: ResetPasswordDTO): Promise<{
        success: boolean;
    }>;
    resetPasswordWithCode(dto: ResetPasswordWithCodeDTO): Promise<{
        success: boolean;
    }>;
}
