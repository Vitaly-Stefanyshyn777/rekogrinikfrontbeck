import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class PostService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post | null>;
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PostWhereUniqueInput;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput;
    }): Promise<Post[]>;
    create(data: Prisma.PostCreateInput): Promise<Post>;
    update(params: {
        where: Prisma.PostWhereUniqueInput;
        data: Prisma.PostUpdateInput;
    }): Promise<Post>;
    delete(where: Prisma.PostWhereUniqueInput): Promise<Post>;
}
