import { IDoc } from '/imports/typings/IDoc';
import { ISchema } from '/imports/typings/ISchema';

export interface ITask extends IDoc {
	title: String;
	description: string;
	isPrivate: boolean;
	isDone: boolean;
	ownedBy: string;
}

export const taskSchema: ISchema<ITask> = {
	title: {
		type: String,
		label: 'Titulo da Tarefa',
		defaultValue: '',
		optional: false
	},
	description: {
		type: String,
		label: 'Detalhes da Tarefa',
		optional: true
	},
	isPrivate: {
		type: Boolean,
		label: 'A tarefa e pessoal?',
		defaultValue: false,
		optional: true
	},
	isDone: {
		type: Boolean,
		label: 'A tarefa esta concluida?',
		defaultValue: false,
		optional: true
	},
	ownedBy: {
		type: String,
		defaultValue: '',
		optional: true
	}
};
