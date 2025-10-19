import { User } from '@prisma/client';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAll(): Promise<User[]>;
    signupUser(userData: {
        name?: string;
        email: string;
        password: string;
    }): Promise<User>;
}
