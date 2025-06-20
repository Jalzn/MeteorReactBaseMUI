import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';

export const taskMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/tasks',
		name: 'Tarefas',
		icon: <SysIcon name={'draft'} />
	}
];
