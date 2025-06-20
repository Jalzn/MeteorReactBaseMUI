import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import { TaskListController } from './pages/TaskList/TaskList.controller';
import { TaskDetailsController } from './pages/TaskDetails/TaskDetails.controller';

export interface ITaskModuleContext {
	state: string;
	id?: string;
}

export const TaskModuleContext = createContext({} as ITaskModuleContext);

export const TaskContainer = (props: IDefaultContainerProps) => {
	const { screenState, taskId } = useParams();

	const state = screenState ?? props.screenState ?? '';
	const id = taskId ?? props.id;

	const validState = ['create', 'view', 'edit'];

	const renderPage = () => {
		if (state && validState.includes(state)) {
			return <TaskDetailsController />;
		}
		return <TaskListController />;
	};

	const provider = { state, id };

	return <TaskModuleContext.Provider value={provider}>{renderPage()}</TaskModuleContext.Provider>;
};
