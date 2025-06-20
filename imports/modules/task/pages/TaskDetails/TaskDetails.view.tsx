import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { TaskDetailsViewStyled } from './TaskDetails.style';
import SysForm from '/imports/ui/components/sysForm/sysForm';
import SysFormButton from '/imports/ui/components/sysFormFields/sysFormButton/sysFormButton';
import React, { useContext, useRef } from 'react';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import SysSwitch from '/imports/ui/components/sysFormFields/sysSwitch/sysSwitch';
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import { TaskDetailsControllerContext } from './TaskDetails.controller';
import { taskSchema } from '../../api/task.schema';
import { ISysFormRef } from '/imports/ui/components/sysForm/typings';

export const TaskDetailsView = () => {
	const formRef = useRef<ISysFormRef>(null);

	const { state, task, loading, onSubmit, closePage, changeToEdit, changeToView } =
		useContext(TaskDetailsControllerContext);

	const isView = state === 'view';
	const isEdit = state === 'edit';
	const isCreate = state === 'create';

	const { Container, Body, Header, Footer, FormColumn } = TaskDetailsViewStyled;

	if (loading) {
		return (
			<Container>
				<CircularProgress />
			</Container>
		);
	}

	return (
		<Container>
			<Header>
				{isView && (
					<IconButton onClick={closePage}>
						<SysIcon name={'arrowBack'} />
					</IconButton>
				)}
				<Typography variant="h5" sx={{ flexGrow: 1 }}>
					{isCreate ? 'Adicionar Tarefa' : isEdit ? 'Editar Item' : task?.title}
				</Typography>
				{!isCreate && (
					<IconButton onClick={isView ? changeToEdit : changeToView}>
						{isView ? <SysIcon name={'edit'} /> : <SysIcon name={'close'} />}
					</IconButton>
				)}
			</Header>
			<SysForm
				ref={formRef}
				mode={state as 'create' | 'view' | 'edit'}
				schema={taskSchema}
				doc={task ?? undefined}
				onSubmit={onSubmit}
				loading={loading}>
				<Body>
					<FormColumn>
						<SysTextField name="title" placeholder="Ex.: Item XX" />
						<SysTextField
							name="description"
							placeholder="Acrescente informações sobre o item (3 linhas)"
							multiline
							rows={3}
							maxRows={3}
							showNumberCharactersTyped
							max={200}
						/>
						<SysSwitch name="isPrivate" />
					</FormColumn>
				</Body>
				<Footer>
					{!isView && (
						<Button variant="outlined" startIcon={<SysIcon name={'close'} />} onClick={closePage}>
							Cancelar
						</Button>
					)}
					<SysFormButton>Salvar</SysFormButton>
				</Footer>
			</SysForm>
		</Container>
	);
};
