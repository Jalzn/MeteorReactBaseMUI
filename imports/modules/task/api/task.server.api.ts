import { IUserProfile } from '../../userprofile/api/userProfileSch';
import { userprofileServerApi } from '../../userprofile/api/userProfileServerApi';
import { Recurso } from '../config/recurso';
import { ITask, taskSchema } from './task.schema';
import { ProductServerBase } from '/imports/api/productServerBase';

class TaskServerApi extends ProductServerBase<ITask> {
	constructor() {
		super('task', taskSchema, {
			resources: Recurso
		});

		this.addTransformedPublication(
			'taskList',
			(filter = {}, pageable = {}) => this.defaultListCollectionPublication(filter, pageable),
			async (task: ITask & { profile: IUserProfile }) => {
				const profile = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: task.ownedBy });
				return { ...task, profile };
			}
		);

		this.addPublication('taskDetails', (filter = {}) => this.defaultDetailCollectionPublication(filter, {}));

		this.registerMethod('count', (filter = {}) => this.getCollectionInstance().find(filter).countAsync());
	}
}

export const taskServerApi = new TaskServerApi();
