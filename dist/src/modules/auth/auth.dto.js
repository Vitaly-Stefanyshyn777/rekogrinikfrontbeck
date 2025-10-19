"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDTO = exports.RequestPasswordResetDTO = exports.LoginUserDTO = exports.RegisterUserDTO = exports.AuthResponseDTO = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const strings_1 = require("../../shared/constants/strings");
class AuthResponseDTO {
}
exports.AuthResponseDTO = AuthResponseDTO;
class RegisterUserDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "password", void 0);
exports.RegisterUserDTO = RegisterUserDTO;
class LoginUserDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)({}, { message: strings_1.INVALID_EMAIL }),
    __metadata("design:type", String)
], LoginUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginUserDTO.prototype, "password", void 0);
exports.LoginUserDTO = LoginUserDTO;
class RequestPasswordResetDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)({}, { message: strings_1.INVALID_EMAIL }),
    __metadata("design:type", String)
], RequestPasswordResetDTO.prototype, "email", void 0);
exports.RequestPasswordResetDTO = RequestPasswordResetDTO;
class ResetPasswordDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResetPasswordDTO.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResetPasswordDTO.prototype, "newPassword", void 0);
exports.ResetPasswordDTO = ResetPasswordDTO;
//# sourceMappingURL=auth.dto.js.map