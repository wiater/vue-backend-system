import { injectable } from "inversify";
import { prisma } from "@/prisma";
import type { UserItem } from "./types";
import { Prisma } from "@/generated/client";
import bcrypt from "bcrypt";
@injectable()
export class UserService {
  constructor() {}

  toNum(value: unknown, defaultValue = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : defaultValue;
  }
  async findUserById(idNum: unknown) {
    const id = this.toNum(idNum);
    const result = await prisma.user.findUnique({ where: { id } });
    if (!result) return Promise.reject({ code: 404, msg: "用户不存在" });
    return result;
  }

  async getUserList(query: any) {
    const pageNum = this.toNum(query.pageNum, 1);
    const pageSize = this.toNum(query.pageSize, 10);
    const where: any = {};
    const rawusername = query.username;
    const username = rawusername ? rawusername.toString().replace(/['"]/g, "").trim() : "";
    if (username) {
      where.username = { contains: username };
    } // 模糊匹配
    // 状态
    if (query.status !== undefined && query.status !== "" && query.status !== null) {
      where.status = this.toNum(query.status,-1);
    }

    if (query.role !== undefined && query.role !== "" && query.role !== null) {
      const role = query.role.toString().replace(/['"]/g, "").trim();
        where.roles = { array_contains: [role]};
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
      prisma.user.findMany({
        where,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { list, total, pageNum, pageSize };
  }

  //创建用户
  async createUser(data: Omit<UserItem, "id">) {
    const { username,name, role,password, status, create_time } = data || {};
    if (!username)
      return Promise.reject({ code: 400, msg: "参数不合法" });
    const hashPwd = await bcrypt.hash(password,10)
    const newData = {
      username: String(username),
      password:hashPwd,
      name:String(name),
      roles: role.includes("admin") ? ["admin"] : ["user"],
      status: status === 0 ? 0 : 1,
      create_time: create_time
        ? new Date(create_time)
        : new Date().toLocaleString(),
    };
    return prisma.user.create({ data: newData });
  }

  // 更新用户
  async updateUser(data: Omit<UserItem, "id">, idNum: unknown) {
    const id = this.toNum(idNum);
    const User = await this.findUserById(id);
    if (!User) return Promise.reject({ code: 404, msg: "用户不存在" });
    const { username, name,password, role,status } = data || {};
    if (!username)
      return Promise.reject({ code: 400, msg: "参数不合法" });
    
    const newData: Prisma.UserUpdateInput = {
      username: String(username),
      name: String(name),
      status: status === 0 ? 0 : 1,
      roles: role.includes("admin") ? ["admin"] : ["user"],
    };
    if(password && password.trim()!=='') {
       newData.password = await bcrypt.hash(password,10)
    }
    return prisma.user.update({ where: { id }, data: newData });
  }

  //删除用户
  async deleteUser(idNum: unknown) {
    const id = this.toNum(idNum);
    const User = await this.findUserById(id);
    if (!User) return Promise.reject({ code: 404, msg: "用户不存在" });
    return prisma.user.delete({ where: { id } });
  }


  //批量删除
  async batchDeleteUser(ids: unknown) {
    let newIds = Array.isArray(ids) ? ids.map((i) => Number(i)) : [];
    if (!newIds.length)
      return Promise.reject({ code: 400, msg: "ids 不能为空" });
    const idSet = Array.from(new Set(newIds));
    return prisma.user.deleteMany({ where: { id: { in: idSet } } });
  }

}
