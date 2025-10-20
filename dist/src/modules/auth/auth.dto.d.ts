import { User } from "@prisma/client";
export declare class AuthResponseDTO {
    user: User;
    accessToken: string;
}
export declare class RegisterUserDTO {
    email: string;
    name: string;
    password: string;
}
export declare class LoginUserDTO {
    email: string;
    password: string;
}
export declare class RequestPasswordResetDTO {
    email: string;
}
export declare class RequestPasswordResetCodeDTO {
    email: string;
    sendToEmail: string;
}
export declare class ResetPasswordDTO {
    token: string;
    newPassword: string;
}
export declare class ResetPasswordWithCodeDTO {
    email: string;
    code: string;
    newPassword: string;
}
