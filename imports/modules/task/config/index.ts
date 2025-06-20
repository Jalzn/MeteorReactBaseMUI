import { IModuleHub } from '../../modulesTypings';
import { taskMenuItemList } from './task.appmenu';
import { taskRouterList } from './task.router';

const taskModule: IModuleHub = {
	pagesRouterList: taskRouterList,
	pagesMenuItemList: taskMenuItemList
};

export default taskModule;
