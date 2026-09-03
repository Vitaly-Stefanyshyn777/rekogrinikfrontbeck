import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./auth.jwt.guard";
import { TokensService } from "./tokens.service";

class CreateTokenDTO {
  expiresIn?: number;
  label?: string;
}

@ApiTags("tokens")
@Controller("tokens")
export class TokensController {
  constructor(private tokensService: TokensService) {}

  // List tokens for a user (admin or owner)
  @UseGuards(JwtAuthGuard)
  @Get("user/:id")
  async list(@Param("id") id: string, @Request() req) {
    const userId = Number(id);
    const requester = req.user;

    const isAdmin =
      requester &&
      (requester.email === process.env.ADMIN_EMAIL || requester.id === 1);
    if (!isAdmin && requester.id !== userId) {
      return [];
    }

    return this.tokensService.listForUser(userId);
  }

  // Create token for user (admin or owner)
  @UseGuards(JwtAuthGuard)
  @Post("user/:id")
  async create(
    @Param("id") id: string,
    @Body() dto: CreateTokenDTO,
    @Request() req,
  ) {
    const userId = Number(id);
    const requester = req.user;
    const isAdmin =
      requester &&
      (requester.email === process.env.ADMIN_EMAIL || requester.id === 1);
    if (!isAdmin && requester.id !== userId) {
      return { success: false, message: "Forbidden" };
    }

    const createdBy = isAdmin ? requester.id : requester.id;
    return this.tokensService.createForUser(
      userId,
      dto.expiresIn,
      dto.label,
      createdBy,
    );
  }

  // Revoke token by jti
  @UseGuards(JwtAuthGuard)
  @Delete(":jti")
  async revoke(@Param("jti") jti: string, @Request() req) {
    const requester = req.user;
    const isAdmin =
      requester &&
      (requester.email === process.env.ADMIN_EMAIL || requester.id === 1);
    if (!isAdmin) {
      return { success: false, message: "Forbidden" };
    }

    await this.tokensService.revokeByJti(jti);
    return { success: true };
  }
}
