
export type PostInputDto = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
};

export type PostsQueryDto = {
    searchNameTerm?: string;
    searchContentTerm?: string;
    blogId?: string; // Для фильтрации постов по ID блога
    pageNumber?: number;
    pageSize?: number;
    sortDirection?: string;
    sortBy?: string;
    // sortBy и sortDirection удалены
};

export type Paged<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
};