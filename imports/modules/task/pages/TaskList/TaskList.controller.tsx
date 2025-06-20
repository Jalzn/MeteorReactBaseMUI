import React, { ChangeEvent, createContext, useContext, useMemo, useRef, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { taskApi } from '../../api/task.api';
import { TaskListView } from './TaskList.view';
import { ITaskWithProfile } from '../../task.types';
import { ITask } from '../../api/task.schema';
import { useNavigate } from 'react-router-dom';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import { nanoid } from 'nanoid';
import AuthContext from '/imports/app/authProvider/authContext';

export interface ITaskListControllerContext {
	tasks: ITaskWithProfile[];
	loading: boolean;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	setPageSize: (value: number) => void;
	setCurrentPage: (value: number) => void;
	findTaskByTitle: (e: ChangeEvent<HTMLInputElement>) => void;
	onlyPending: boolean;
	toggleOnyPending: () => void;
	onlyByMe: boolean;
	toggleOnlyByMe: () => void;
	onCreateTask: () => void;
	onEditTask: (task: ITask) => void;
	onDeleteTask: (task: ITask) => void;
	onCheckTask: (task: ITask, value: boolean) => void;

	onSelectTask: (task: ITaskWithProfile | null) => void;
	selectedTask: ITaskWithProfile | null;
	showDrawer: boolean;
}

export const TaskListControllerContext = createContext({} as ITaskListControllerContext);

export const TaskListController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext(AppLayoutContext);
	const { user } = useContext(AuthContext);

	const [searchBy, setSearchBy] = useState('');
	const [onlyPending, setOnlyPending] = useState(false);
	const [onlyByMe, setOnlyByMe] = useState(false);

	const toggleOnyPending = () => setOnlyPending(!onlyPending);
	const toggleOnlyByMe = () => setOnlyByMe(!onlyByMe);

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [totalPages, setTotalPages] = useState(0);

	const [showDrawer, setShowDrawer] = useState(false);
	const [selectedTask, setSelectedTask] = useState<ITaskWithProfile | null>(null);

	const onSelectTask = (task: ITaskWithProfile | null) => {
		setSelectedTask(task);
		setShowDrawer(task ? true : false);
	};

	const { tasks, loading }: { tasks: ITaskWithProfile[]; loading: boolean } = useTracker(() => {
		const baseOr = [{ isPrivate: false }, { ownedBy: user?._id }];

		const andConditions: any[] = [];

		if (searchBy) {
			andConditions.push({ title: { $regex: `^${searchBy}`, $options: 'i' } });
		}

		if (onlyPending) {
			andConditions.push({ isDone: false });
		}

		if (onlyByMe) {
			andConditions.push({ ownedBy: user?._id });
		}

		const filter: Record<string, any> = {
			$or: baseOr,
			...(andConditions.length > 0 && { $and: andConditions })
		};

		const skip = (currentPage - 1) * pageSize;
		const sort = {};
		const limit = pageSize;

		const subHandle = taskApi.subscribe('taskList', filter, { skip, sort, limit });

		const tasks = subHandle?.ready() ? taskApi.find(filter).fetch() : [];

		taskApi.callMethodWithPromise('count', filter).then((value) => {
			const total = Math.ceil(value / pageSize);
			setTotalPages(total);
		});

		return {
			tasks,
			loading: !!subHandle && !subHandle.ready()
		};
	}, [currentPage, pageSize, searchBy, onlyPending, onlyByMe]);

	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	const findTaskByTitle = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			setSearchBy(value);
		}, 500);
	};

	const onCreateTask = () => {
		const id = nanoid();
		navigate(`/tasks/create/${id}`);
	};

	const onEditTask = (task: ITask) => {
		if (user?._id !== task.ownedBy) {
			return showNotification({
				type: 'error',
				message: 'Somente o proprietario pode alterar sua tarefa'
			});
		}
		navigate(`/tasks/edit/${task._id}`);
	};

	const onDeleteTask = (task: ITask) => {
		if (user?._id !== task.ownedBy) {
			return showNotification({
				type: 'error',
				message: 'Somente o proprietario pode remover sua tarefa'
			});
		}
		taskApi.remove(task, (e, r) => {
			if (!e) {
				showNotification({
					type: 'success',
					message: 'Tarefa removida com sucesso'
				});
			} else {
				showNotification({
					type: 'error',
					message: 'Opss, algo deu errado'
				});
			}
		});
	};

	const onCheckTask = (task: ITask, value: boolean) => {
		taskApi.update({ ...task, isDone: value });
	};

	const provider = useMemo(
		() => ({
			tasks,
			loading,
			currentPage,
			pageSize,
			totalPages,
			setPageSize,
			setCurrentPage,
			onlyPending,
			toggleOnyPending,
			onlyByMe,
			toggleOnlyByMe,
			findTaskByTitle,
			onCreateTask,
			onEditTask,
			onDeleteTask,
			onCheckTask,
			onSelectTask,
			selectedTask,
			showDrawer
		}),
		[tasks, loading, currentPage, pageSize, totalPages, onlyPending, onlyByMe, searchBy, selectedTask, showDrawer]
	);

	return (
		<TaskListControllerContext.Provider value={provider}>
			<TaskListView />
		</TaskListControllerContext.Provider>
	);
};
