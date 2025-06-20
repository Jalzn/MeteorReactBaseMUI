import { ElementType } from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import { sysSizing } from '../../../../ui/materialui/styles';
import { SysSectionPaddingXY } from '../../../../ui/layoutComponents/sysLayoutComponents';
import sysLightPalette from '/imports/ui/materialui/sysColors';

interface ITaskListViewStyled {
	Container: ElementType<BoxProps>;
}

const TaskListViewStyled: ITaskListViewStyled = {
	Container: styled(SysSectionPaddingXY)(() => ({
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '100%',
		gap: sysSizing.spacingFixedMd,
		marginBottom: sysSizing.contentFabDistance
	}))
};

export default TaskListViewStyled;
