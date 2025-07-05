
export type BlogInputDto = {
    name: string,
    description: string,
    websiteUrl: string
};

export type BlogQueryDto = {
    searchNameTerm?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: number;
    pageSize?: number;
};
