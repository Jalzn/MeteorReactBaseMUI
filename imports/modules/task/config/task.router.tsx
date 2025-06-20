import { IRoute } from '../../../modules/modulesTypings';
import { Recurso } from './recurso';
import { TaskContainer } from '../TaskContainer';

export const taskRouterList: (IRoute | null)[] = [
	{
		path: '/tasks/:screenState/:taskId',
		component: TaskContainer,
		isProtected: true,
		resources: [Recurso.TASK_VIEW]
	},
	{
		path: '/tasks/:screenState',
		component: TaskContainer,
		isProtected: true,
		resources: [Recurso.TASK_VIEW]
	},
	{
		path: '/tasks',
		component: TaskContainer,
		isProtected: true,
		resources: [Recurso.TASK_VIEW]
	}
];
