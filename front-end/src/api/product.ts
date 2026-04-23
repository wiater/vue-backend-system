import request from "./request";

export interface ProductItem {
    id: number;
    name: string;
    price: number;
    status: 0 | 1;
    create_time: string;
}

export interface ProductQuery {
    pageNum: number;
    pageSize: number;
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



// 获取商品列表
export async function getProductListApi(params: ProductQuery): Promise<ProductPageResult> {
    const res = await request.get('/products', { params }) as ProductPageResult
    return {
        list: res?.list || [],
        total: Number(res?.total || 0),
    }
}

// 获取商品详情
export async function getProductDetailApi(id: number) {
    return request.get(`/products/${id}`)
}

// 创建商品
export async function createProductApi(data: Omit<ProductItem, 'id'>) {
    return request.post('/products', data)
}

// 更新商品
export async function updateProductApi(data: ProductItem) {
    return request.put(`/products/${data.id}`, data)
}

// 删除商品
export async function deleteProductApi(id: number) {
    return request.delete(`/products/${id}`)
}

// 批量删除商品
export async function batchDeleteProductApi(ids: number[]) {
    return request.post('/products/batch-delete', { ids })
}

// 导入商品(excel)
export async function importProductApi(formData:FormData) {
    return request.post('/products/import', formData)
}