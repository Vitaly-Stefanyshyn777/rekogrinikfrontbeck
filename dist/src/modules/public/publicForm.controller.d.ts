import { PrismaService } from "../prisma/prisma.service";
import { PublicFormDTO } from "./publicForm.dto";
export declare class PublicFormController {
    private prisma;
    constructor(prisma: PrismaService);
    submit(dto: PublicFormDTO, userAgent?: string, ip?: string): Promise<{
        id: number;
        createdAt: Date;
    }>;
    list(limit?: number): Promise<{
        id: number;
        name: string;
        phone: string;
        email: string;
        workType: string;
        message: string;
        consent: boolean;
        address: string;
        contactTime: string;
        source: import("@prisma/client").Prisma.JsonValue;
        files: import("@prisma/client").Prisma.JsonValue;
        locale: string;
        createdAt: Date;
    }[]>;
    getById(id: number): Promise<{
        id: number;
        name: string;
        phone: string;
        email: string;
        workType: string;
        message: string;
        consent: boolean;
        address: string;
        contactTime: string;
        source: import("@prisma/client").Prisma.JsonValue;
        files: import("@prisma/client").Prisma.JsonValue;
        locale: string;
        createdAt: Date;
    }>;
}
