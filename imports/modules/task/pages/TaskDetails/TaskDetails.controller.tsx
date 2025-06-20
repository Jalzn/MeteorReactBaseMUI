import React, { createContext, useContext, useMemo } from 'react';
import { ITask } from '../../api/task.schema';
import { TaskModuleContext } from '../../TaskContainer';
import SysAppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import AuthContext from '/imports/app/authProvider/authContext';
import { useTracker } from 'meteor/react-meteor-data';
import { taskApi } from '../../api/task.api';
import { useNavigate } from 'react-router-dom';
import { TaskDetailsView } from './TaskDetails.view';
import { IMeteorError } from '/imports/typings/IMeteorError';

export interface ITaskDetailsControllerContext {
	state: string;
	task: ITask | null;
	loading: boolean;
	onSubmit: (task: ITask) => void;
	closePage: () => void;
	changeToView: () => void;
	changeToEdit: () => void;
}

export const TaskDetailsControllerContext = createContext({} as ITaskDetailsControllerContext);

export const TaskDetailsController = () => {
	const { id, state } = useContext(TaskModuleContext);
	const { showNotification } = useContext(SysAppLayoutContext);
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const { task, loading }: { task: ITask | null; loading: boolean } = useTracker(() => {
		const subHandle = taskApi.subscribe('taskDetails', { _id: id });
		const task = subHandle?.ready() ? taskApi.findOne({ _id: id }) : null;

		return {
			task: task as ITask | null,
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const onSubmit = (task: ITask) => {
		const action = state === 'create' ? 'insert' : 'update';

		if (state === 'create') {
			task = { ...task, ownedBy: user?._id ?? '', isDone: false };
		}

		taskApi[action](task, (e: IMeteorError) => {
			if (!e) {
				showNotification({
					type: 'success',
					message: 'Tarefa atualizada com sucesso'
				});
				closePage();
			} else {
				showNotification({
					type: 'error',
					message: 'Opss, algo deu errado'
				});
			}
		});
	};

	const closePage = () => {
		navigate('/tasks');
	};

	const changeToView = () => {
		navigate(`/tasks/view/${id}`);
	};

	const changeToEdit = () => {
		navigate(`/tasks/edit/${id}`);
	};

	const provider = useMemo(
		() => ({
			state,
			task,
			loading,
			onSubmit,
			closePage,
			changeToView,
			changeToEdit
		}),
		[state, task, loading]
	);

	return (
		<TaskDetailsControllerContext.Provider value={provider}>
			<TaskDetailsView />
		</TaskDetailsControllerContext.Provider>
	);
};
