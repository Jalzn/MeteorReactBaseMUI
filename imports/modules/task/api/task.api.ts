import { ITask, taskSchema } from './task.schema';
import { ProductBase } from '/imports/api/productBase';

class TaskApi extends ProductBase<ITask> {
	constructor() {
		super('task', taskSchema, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const taskApi = new TaskApi();
