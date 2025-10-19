import { PrismaClientOptions } from "@prisma/client/runtime";
export type LogLevel = "info" | "query" | "warn" | "error";
export type LogDefinition = {
    level: LogLevel;
    emit: "stdout" | "event";
};
export declare const PRISMA_LOG_CONFIG: Array<LogDefinition>;
export declare const PRISMA_CLIENT_OPTIONS: PrismaClientOptions;
