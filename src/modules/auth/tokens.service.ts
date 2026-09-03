import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";

@Injectable()
export class TokensService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async listForUser(userId: number) {
    return (this.prisma as any).apiToken.findMany({ where: { userId } });
  }

  async createForUser(
    userId: number,
    expiresInSeconds?: number,
    label?: string,
    createdBy?: number,
  ) {
    const jti = randomBytes(12).toString("hex");
    const expiresAt = expiresInSeconds
      ? new Date(Date.now() + expiresInSeconds * 1000)
      : null;

    const payload = { id: userId, jti } as any;
    const token = this.jwtService.sign(
      payload,
      expiresInSeconds ? { expiresIn: expiresInSeconds } : undefined,
    );

    const record = await (this.prisma as any).apiToken.create({
      data: {
        jti,
        userId,
        label,
        createdBy,
        expiresAt,
      },
    });

    return { token, record };
  }

  async revokeByJti(jti: string) {
    const token = await (this.prisma as any).apiToken.findUnique({
      where: { jti },
    });
    if (!token) throw new NotFoundException("Token not found");
    return (this.prisma as any).apiToken.update({
      where: { jti },
      data: { revoked: true },
    });
  }
}
