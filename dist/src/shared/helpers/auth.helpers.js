"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHelpers = void 0;
const crypto_1 = require("crypto");
const hash = (password) => {
    return new Promise((resolve, reject) => {
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        (0, crypto_1.scrypt)(password, salt, 64, (err, derivedKey) => {
            if (err)
                reject(err);
            resolve(salt + ':' + derivedKey.toString('hex'));
        });
    });
};
const verify = (password, hash) => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(':');
        (0, crypto_1.scrypt)(password, salt, 64, (err, derivedKey) => {
            if (err)
                reject(err);
            resolve(key == derivedKey.toString('hex'));
        });
    });
};
exports.AuthHelpers = {
    hash,
    verify,
};
//# sourceMappingURL=auth.helpers.js.map