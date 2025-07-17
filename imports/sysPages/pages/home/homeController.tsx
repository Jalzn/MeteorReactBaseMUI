import React, { useContext } from 'react';
import { createContext, useMemo } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { taskApi } from '/imports/modules/task/api/task.api';
import HomeView from './homeView';
import { ITaskWithProfile } from '/imports/modules/task/task.types';
import AuthContext from '/imports/app/authProvider/authContext';

interface IHomeContext {
	tasks: ITaskWithProfile[];
	loading: boolean;
}

export const HomeContext = createContext<IHomeContext>({} as IHomeContext);

export const HomeController = () => {
	const { user } = useContext(AuthContext);

	const { loading, tasks } = useTracker(() => {
		const subHandle = taskApi.subscribe(
			'taskList',
			{
				'$or': [{ isPrivate: false }, { ownedBy: user?._id }]
			},
			{
				sort: { createdat: -1 },
				limit: 5
			}
		);

		const tasks = subHandle?.ready() ? taskApi.find({}).fetch() : [];
		console.log(tasks);

		return {
			tasks,
			loading: !!subHandle && !subHandle.ready()
		};
	});

	const providerValues = useMemo(
		() => ({
			tasks,
			loading
		}),
		[tasks, loading]
	);

	return (
		<HomeContext.Provider value={providerValues}>
			<HomeView />
		</HomeContext.Provider>
	);
};
