export interface ProductItem {
    id: number;
    name: string;
    price: number;
    status: 0 | 1;
    create_time: string;
}

export interface ProductQuery {
    pageNum?: number;
    pageSize?: number;
    name?: string;
    status?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    startDate?: string;
    endDate?: string;
}

export interface ProductPageResult {
    list: ProductItem[];
    total: number;
}