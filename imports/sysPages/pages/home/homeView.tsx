import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import HomeStyles from './homeStyle';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import { Box, Checkbox, List, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import { HomeContext } from './homeController';
import { Link } from 'react-router-dom';
import { Check, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';

const HomeView: React.FC = () => {
	const { user } = useContext<IAuthContext>(AuthContext);
	const { Container, Header } = HomeStyles;
	const { tasks, loading } = useContext(HomeContext);

	return (
		<>
			<Container>
				<Header>
					<Typography variant="h2">Olá, {user?.username}</Typography>
					<Typography variant="body1" textAlign="justify">
						Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu time, por você e para você.
					</Typography>
				</Header>

				<Box>
					<Typography variant="h5">Atividades recentes</Typography>

					{loading ? (
						<>
							<Skeleton variant="text" height={40} width="60%" />
							<Skeleton variant="rectangular" height={80} sx={{ my: 1 }} />
							<Skeleton variant="rectangular" height={80} sx={{ my: 1 }} />
							<Skeleton variant="rectangular" height={80} sx={{ my: 1 }} />
						</>
					) : (
						<List>
							{tasks.map((task) => (
								<ListItem key={task._id}>
									<ListItemIcon>
										<Checkbox
											edge="start"
											checked={task.isDone}
											tabIndex={-1}
											icon={<RadioButtonUnchecked />}
											checkedIcon={<Check />}
											onChange={() => {}}
										/>
									</ListItemIcon>
									{task && (
										<ListItemText
											primary={task.title}
											secondary={
												<Typography variant="body2" color="text.secondary">
													Criada por: <strong>{task.profile?.username}</strong>
												</Typography>
											}
										/>
									)}
								</ListItem>
							))}
						</List>
					)}
				</Box>
			</Container>
			<Link to="/tasks">
				<SysFab
					variant="extended"
					text="Minhas Tarefas"
					fixed={true}
					color="primary"
					sx={{
						right: '50%'
					}}
				/>
			</Link>
		</>
	);
};

export default HomeView;
