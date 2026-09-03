import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";

import { JWT_SECRET } from "../../shared/constants/global.constants";
import { PrismaService } from "../prisma/prisma.service";

const cookieExtractor = (req) => req?.cookies.accessToken;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("token"),
        cookieExtractor,
      ]),
      ignoreExpiration: process.env.NODE_ENV === "dev",
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<User> {
    const email = payload.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    // If JWT contains jti, ensure token wasn't revoked
    if (payload.jti) {
      const tokenRecord = await (this.prisma as any).apiToken.findUnique({
        where: { jti: payload.jti },
      });

      if (!tokenRecord || tokenRecord.revoked) {
        throw new UnauthorizedException();
      }

      if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException();
      }
    }

    return { ...user, isSuper: payload.isSuper === true } as User;
  }
}
