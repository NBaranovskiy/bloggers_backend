import {Paged, PostInputDto, PostsQueryDto} from "../dto/post.input-dto";
import {Post} from "../types/post";
import {postsRepository} from "../repositories/posts.repository";

export const postsServices = {
    async findAll(queryDto: PostsQueryDto) : Promise<Paged<Post>> {
        return postsRepository.findAll(queryDto)
    },

    async findByIdorFail(id: string): Promise<Post | null>{
        return postsRepository.findById(id)
    },

    async create(queryDto: PostInputDto) : Promise<Post> {
        return postsRepository.create(queryDto)
    },

    async update(id: string, queryDto: PostInputDto) : Promise<boolean> {
        return postsServices.update(id, queryDto)
    },

    async delete(id: string) : Promise<boolean> {
        return postsServices.delete(id)
    },


};