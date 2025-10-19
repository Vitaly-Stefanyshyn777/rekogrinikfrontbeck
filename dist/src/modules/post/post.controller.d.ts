import { Post as PostModel } from '@prisma/client';
import { PostService } from './post.service';
export declare class PostController {
    private postService;
    constructor(postService: PostService);
    getAllPosts(): Promise<PostModel[]>;
    getPostById(id: string): Promise<PostModel>;
    getPublishedPosts(): Promise<PostModel[]>;
    getFilteredPosts(searchString: string): Promise<PostModel[]>;
    createDraft(postData: {
        title: string;
        content?: string;
        authorEmail: string;
    }): Promise<PostModel>;
    publishPost(id: string): Promise<PostModel>;
    deletePost(id: string): Promise<PostModel>;
}
