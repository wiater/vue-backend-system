import { Container } from "inversify";
// import { UserController} from "@/modules/user/UserController";
// import { UserService} from "@/modules/user/UserService";
import { MenuController} from "@/modules/menu/MenuController";
import { DashBoardController } from "@/modules/dashboard/DashBoardController";
import { AuthController } from "@/modules/auth/AuthController";
import { AuthService } from "@/modules/auth/AuthService";
import {ProductController} from "@/modules/product/ProductController"
import {ProductService} from "@/modules/product/ProductService"
import { UserController } from "./modules/user/UserController";
import {UserService} from "./modules/user/UserService"
const container = new Container();
/**
 * User模块
 */
// container.bind<UserService>(UserService).to(UserService)
// container.bind<UserController>(UserController).to(UserController)
container.bind<MenuController>(MenuController).to(MenuController)
container.bind<DashBoardController>(DashBoardController).to(DashBoardController)
container.bind<AuthService>(AuthService).to(AuthService)
container.bind<AuthController>(AuthController).to(AuthController)
container.bind<ProductService>(ProductService).to(ProductService)
container.bind<ProductController>(ProductController).to(ProductController)
container.bind<UserService>(UserService).to(UserService)
container.bind<UserController>(UserController).to(UserController)
export default container