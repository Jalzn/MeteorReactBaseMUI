import { IAppMenu, IModuleHub, IRoute } from './modulesTypings';
import Example from './example/config';
import Aniversario from './aniversario/config';
import UserProfile from './userprofile/config';
import Task from './task/config';

const pages: Array<IRoute | null> = [
	// ...Example.pagesRouterList,
	// ...Aniversario.pagesRouterList,
	// ...UserProfile.pagesRouterList,
	...Task.pagesRouterList
];

const menuItens: Array<IAppMenu | null> = [
	// ...Example.pagesMenuItemList,
	// ...Aniversario.pagesMenuItemList,
	// ...UserProfile.pagesMenuItemList,
	...Task.pagesMenuItemList
];

const Modules: IModuleHub = {
	pagesMenuItemList: menuItens,
	pagesRouterList: pages
};

export default Modules;
