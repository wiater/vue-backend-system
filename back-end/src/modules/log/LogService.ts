import { injectable } from "inversify";
import { prisma } from "@/prisma";
import type { LogItem } from "./types";

@injectable()
export class LogService {
    async getLogs(): Promise<LogItem[]> {
        const logs = await prisma.log.findMany();
        const result = logs.map((log) => ({
            id: log.id,
            user: log.user,
            content: log.content,
            time: log.time.toLocaleString()
        }))
        return result
    }

    async createLogs(user: string, content: string): Promise<LogItem> {
        const log = await prisma.log.create({
            data: {
                user,
                content,
                time: new Date()
            }
        })
        return {
            id: log.id,
            user: log.user,
            content: log.content,
            time: log.time.toLocaleString()
        }
    }
}