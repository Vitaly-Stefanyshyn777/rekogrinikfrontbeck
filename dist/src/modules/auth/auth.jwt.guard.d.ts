import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "@prisma/client";
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private reflector;
    roles: string[];
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
    handleRequest(err: Error, user: User): any;
}
export {};
