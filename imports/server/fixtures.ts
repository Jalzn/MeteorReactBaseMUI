import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { userprofileServerApi } from '../modules/userprofile/api/userProfileServerApi';
import { taskServerApi } from '../modules/task/api/task.server.api';
import { ITask } from '../modules/task/api/task.schema';

async function createDefautUser() {
	const users = [
		{
			username: 'Jalmir',
			email: 'jalmir@email.com',
			password: 'jalmir123',
			profile: { name: 'Jalmir', email: 'jalmir@email.com' },
			roles: ['Usuario']
		},
		{
			username: 'Administrador',
			email: 'admin@mrb.com',
			password: 'admin@mrb.com',
			profile: { name: 'Admin', email: 'admin@mrb.com' },
			roles: ['Administrador']
		}
	];

	for (const user of users) {
		const alreadyExists = await Accounts.findUserByEmail(user.email);

		if (alreadyExists) {
			continue;
		}

		console.log(`Creating user: ${user.username}`);
		const createdUserId = await Accounts.createUserAsync({
			username: user.username,
			email: user.email,
			password: user.password
		});

		await Meteor.users.upsertAsync(
			{ _id: createdUserId },
			{
				$set: {
					'emails.0.verified': true,
					profile: {
						name: user.profile.name,
						email: user.profile.email
					}
				}
			}
		);

		await userprofileServerApi.getCollectionInstance().insertAsync({
			_id: createdUserId,
			username: user.username,
			email: user.email,
			roles: user.roles
		});
	}
}

async function createDefaultTask() {
	const count = await taskServerApi.getCollectionInstance().find({}).countAsync();

	if (count != 0) {
		return;
	}

	const user = await Accounts.findUserByEmail('admin@mrb.com');

	if (!user) {
		return;
	}

	const tasks = [
		{
			name: 'Finalizar relatório semanal',
			description: 'Concluir o relatório e enviar para o gerente até o fim do dia.'
		},
		{
			name: 'Revisar código da sprint',
			description: 'Fazer uma revisão completa do código e sugerir melhorias.'
		},
		{
			name: 'Preparar apresentação de vendas',
			description: 'Montar os slides com os principais indicadores do trimestre.'
		},
		{
			name: 'Responder e-mails pendentes',
			description: 'Ler e responder os e-mails que chegaram no fim de semana.'
		},
		{
			name: 'Atualizar backlog do projeto',
			description: 'Revisar e reorganizar as tarefas do time no Jira.'
		},
		{
			name: 'Testar funcionalidade de login',
			description: 'Garantir que o login funcione corretamente em todos os browsers.'
		},
		{
			name: 'Agendar reunião com o cliente',
			description: 'Marcar uma call com o cliente para revisar as entregas.'
		},
		{
			name: 'Corrigir bugs críticos',
			description: 'Resolver os erros encontrados em produção com urgência.'
		},
		{
			name: 'Criar wireframe da nova tela',
			description: 'Esboçar o layout da nova tela seguindo o design system.'
		},
		{
			name: 'Documentar processo de deploy',
			description: 'Criar um passo a passo para o processo de publicação em produção.'
		}
	];

	for (const { name, description } of tasks) {
		console.log(`[Server] Creating task "${name}" for admin...`);
		const task: ITask = {
			title: name,
			description: description,
			isPrivate: false,
			isDone: false,
			ownedBy: user._id
		};

		await taskServerApi.getCollectionInstance().insertAsync(task);
	}
}

// if the database is empty on server start, create some sample data.
Meteor.startup(async () => {
	console.log('fixtures Meteor.startup');
	// Add default admin account
	await createDefautUser();
	// Add default task
	await createDefaultTask();
});
