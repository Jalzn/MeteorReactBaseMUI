import { IUserProfile } from '../userprofile/api/userProfileSch';
import { ITask } from './api/task.schema';

export type ITaskWithProfile = ITask & { profile: IUserProfile };
