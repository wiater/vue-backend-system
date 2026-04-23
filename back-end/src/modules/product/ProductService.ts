import { injectable } from "inversify";
import { prisma } from "@/prisma";
import type { ProductItem } from "./types";
@injectable()
export class ProductService {
  constructor() {}

  toNum(value: unknown, defaultValue = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : defaultValue;
  }
  async findProductById(idNum: unknown) {
    const id = this.toNum(idNum);
    const result = await prisma.product.findUnique({ where: { id } });
    if (!result) return Promise.reject({ code: 404, msg: "商品不存在" });
    return result;
  }

  async getProductList(query: any) {
    const pageNum = this.toNum(query.pageNum, 1);
    const pageSize = this.toNum(query.pageSize, 10);
    const where: any = {};
    const rawName = query.name;
    const name = rawName ? rawName.toString().replace(/['"]/g, "").trim() : "";
    if (name) {
      where.name = { contains: name };
    } // 模糊匹配
    // 状态
    if (query.status !== undefined && query.status !== "" && query.status !== null) {
      where.status = this.toNum(query.status,-1);
    }

    // 价格
    where.price = {};
    if (query.minPrice !== undefined && query.minPrice !== "" && query.minPrice !== null) {
      where.price.gte = this.toNum(query.minPrice, Number.MIN_SAFE_INTEGER);
    }
    if (query.maxPrice !== undefined && query.maxPrice !== "" && query.maxPrice !== null) {
      where.price.lte = this.toNum(query.maxPrice, Number.MAX_SAFE_INTEGER);
    }
    if(Object.keys(where.price).length === 0 ){
      delete where.price;
    }
    // 时间
    where.create_time = {};
    if (query.startDate) {
      where.create_time.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.create_time.lte = new Date(query.endDate);
    }
    if(Object.keys(where.create_time).length === 0) {
      delete where.create_time;
    }

    const [list, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return { list, total, pageNum, pageSize };
  }

  //创建商品
  async createProduct(data: Omit<ProductItem, "id">) {
    const { name, price, status, create_time } = data || {};
    if (!name || Number(price) <= 0)
      return Promise.reject({ code: 400, msg: "参数不合法" });
    const newData = {
      name: String(name),
      price: Number(price),
      status: status === 0 ? 0 : 1,
      create_time: create_time
        ? new Date(create_time)
        : new Date().toLocaleString(),
    };
    return prisma.product.create({ data: newData });
  }

  // 更新商品
  async updateProduct(data: Omit<ProductItem, "id">, idNum: unknown) {
    const id = this.toNum(idNum);
    const product = await this.findProductById(id);
    if (!product) return Promise.reject({ code: 404, msg: "商品不存在" });
    const { name, price, status, create_time } = data || {};
    if (!name || Number(price) <= 0)
      return Promise.reject({ code: 400, msg: "参数不合法" });
    const newData = {
      name: String(name),
      price: Number(price),
      status: status === 0 ? 0 : 1,
      create_time: create_time
        ? new Date(create_time)
        : new Date().toLocaleString(),
    };
    return prisma.product.update({ where: { id }, data: newData });
  }

  //删除商品
  async deleteProduct(idNum: unknown) {
    const id = this.toNum(idNum);
    const product = await this.findProductById(id);
    if (!product) return Promise.reject({ code: 404, msg: "商品不存在" });
    return prisma.product.delete({ where: { id } });
  }

  async batchDeleteProduct(ids: unknown) {
    let newIds = Array.isArray(ids) ? ids.map((i) => Number(i)) : [];
    if (!newIds.length)
      return Promise.reject({ code: 400, msg: "ids 不能为空" });
    const idSet = Array.from(new Set(newIds));
    return prisma.product.deleteMany({ where: { id: { in: idSet } } });
  }
}
