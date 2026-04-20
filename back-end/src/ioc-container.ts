import { Container } from "inversify";
import { UserController} from "./modules/user/UserController";
import { UserService} from "./modules/user/UserService";
import { MenuController} from "./modules/menu/MenuController";
import { DashBoardController } from "./modules/dashboard/DashBoardController";
const container = new Container();
/**
 * User模块
 */
container.bind<UserService>(UserService).to(UserService)
container.bind<UserController>(UserController).to(UserController)
container.bind<MenuController>(MenuController).to(MenuController)
container.bind<DashBoardController>(DashBoardController).to(DashBoardController)
export default container