export declare const AuthHelpers: {
    hash: (password: any) => Promise<unknown>;
    verify: (password: any, hash: any) => Promise<unknown>;
};
