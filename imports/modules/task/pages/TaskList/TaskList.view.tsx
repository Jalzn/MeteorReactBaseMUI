import { MouseEvent, useContext, useState } from 'react';
import TaskListViewStyled from './TaskList.style';
import { TaskListControllerContext } from './TaskList.controller';
import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Divider,
	Drawer,
	FormControlLabel,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Pagination,
	Select,
	Slider,
	Switch,
	Typography
} from '@mui/material';
import React from 'react';
import { Check, Close, MoreVert, RadioButtonUnchecked } from '@mui/icons-material';
import { ITaskWithProfile } from '../../task.types';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import AuthContext from '/imports/app/authProvider/authContext';
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import { SysCheckBox } from '/imports/ui/components/sysFormFields/sysCheckBoxField/sysCheckBoxField';

const TaskItem = ({ task }: { task: ITaskWithProfile }) => {
	const { onEditTask, onDeleteTask, onCheckTask, onSelectTask } = useContext(TaskListControllerContext);
	const { user } = useContext(AuthContext);

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const onMenuClick = (e: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const onMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box>
			<ListItem
				secondaryAction={
					<IconButton onClick={onMenuClick}>
						<MoreVert />
					</IconButton>
				}>
				<ListItemIcon>
					<Checkbox
						edge="start"
						checked={task.isDone}
						tabIndex={-1}
						icon={<RadioButtonUnchecked />}
						checkedIcon={<Check />}
						onChange={(_, value) => onCheckTask(task, value)}
					/>
				</ListItemIcon>
				{task && (
					<ListItemText
						primary={task.title}
						secondary={
							<Typography variant="body2" color="text.secondary">
								Criada por:{' '}
								<strong>{user?.username === task.profile?.username ? 'Voce' : task.profile?.username}</strong>
							</Typography>
						}
						onClick={() => onSelectTask(task as ITaskWithProfile)}
					/>
				)}
				<Menu anchorEl={anchorEl} open={!!anchorEl} onClose={onMenuClose}>
					<MenuItem onClick={() => onEditTask(task)}>Editar</MenuItem>
					<MenuItem onClick={() => onDeleteTask(task)}>Excluir</MenuItem>
				</Menu>
			</ListItem>
			<Divider />
		</Box>
	);
};

export const TaskList = () => {
	const { tasks, loading } = useContext(TaskListControllerContext);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<List sx={{ width: '100%' }}>
			{tasks.map((task) => (
				<TaskItem key={task._id} task={task} />
			))}
		</List>
	);
};

export const TaskListView = () => {
	const {
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
		selectedTask,
		showDrawer,
		onSelectTask
	} = useContext(TaskListControllerContext);

	const { Container } = TaskListViewStyled;

	return (
		<Container>
			<Typography variant="h2">Lista de tarefas</Typography>
			<SysTextField name="search" placeholder="Digite o nome da tarefa" onChange={findTaskByTitle} />
			<Box sx={{ display: 'flex', gap: 4 }}>
				<FormControlLabel
					control={<Switch value={onlyPending} onChange={() => toggleOnyPending()} />}
					label="Apenas tarefas pendentes"
				/>
				<FormControlLabel
					control={<Switch value={onlyByMe} onChange={() => toggleOnlyByMe()} />}
					label="Apenas minhas tarefas"
				/>
			</Box>
			<TaskList />
			<Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
				<Pagination
					count={totalPages}
					page={currentPage}
					onChange={(_, page) => setCurrentPage(page)}
					color="primary"
				/>
				<Select sx={{ width: 80 }} value={pageSize} onChange={(e) => setPageSize(e.target.value as number)}>
					<MenuItem value={5}>5</MenuItem>
					<MenuItem value={10}>10</MenuItem>
					<MenuItem value={15}>15</MenuItem>
				</Select>
			</Box>
			<Drawer
				anchor="right"
				open={showDrawer}
				onClose={() => onSelectTask(null)}
				sx={{
					'& .MuiDrawer-paper': {
						width: { xs: '100%', sm: '400px' },
						maxWidth: '100vw'
					}
				}}>
				<Box sx={{ p: 2 }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant="h6">Detalhes da Tarefa</Typography>
						<IconButton onClick={() => onSelectTask(null)} size="small">
							<Close />
						</IconButton>
					</Box>
					<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
						<Box>
							<Typography sx={{ marginBottom: 4 }} variant="h3">
								{selectedTask?.title}
							</Typography>
							<Typography variant="subtitle1">Descricao</Typography>
							<Typography>{selectedTask?.description}</Typography>
						</Box>
						<Box sx={{ marginTop: 'auto' }}>
							<Box sx={{ display: 'flex', marginBottom: 2 }}>
								<Box>
									<Typography variant="subtitle1">Tipo</Typography>
									<Typography>{selectedTask?.isPrivate ? 'Pessoal' : 'Publica'}</Typography>
								</Box>
								{selectedTask?.profile && (
									<Box sx={{ marginLeft: 'auto' }}>
										<Typography variant="subtitle1">Criada por</Typography>
										<Typography>{selectedTask?.profile?.username}</Typography>
									</Box>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			</Drawer>
			<SysFab
				variant="extended"
				text="Adicionar Tarefa"
				startIcon={<SysIcon name={'add'} />}
				fixed={true}
				color="primary"
				onClick={onCreateTask}
			/>
		</Container>
	);
};
