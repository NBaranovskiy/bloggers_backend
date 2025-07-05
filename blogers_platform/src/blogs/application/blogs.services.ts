import {BlogInputDto,BlogQueryDto} from "../dto/blog.input-dto";
import {Blogger} from "../types/blogger";
import {WithId} from "mongodb";
import {bloggersRepository} from "../repositories/bloggers.repository";

export const blogsServices = {
    async findAll(queryDto: BlogQueryDto) : Promise<{ items: Blogger[]; totalCount: number}> {
        return bloggersRepository.findAll(queryDto)
    },

    async findByIdorFail(id: string): Promise<Blogger | null>{
        return bloggersRepository.findById(id)
    },

    async create(queryDto: BlogInputDto) : Promise<Blogger> {
        return bloggersRepository.create(queryDto)
    },

    async update(id: string, queryDto: BlogInputDto) : Promise<boolean> {
        return bloggersRepository.update(id, queryDto)
    },

    async delete(id: string) : Promise<boolean> {
        return bloggersRepository.delete(id)
    },


};