import request from "./request";
export interface Overview {
  totalUser: number
  totalProduct: number
  adminCount: number
  normalProduct: number
  [key: string]: number
}
export const getDashboardApi = () => request.get('./dashboard/overview') as Promise<Overview>