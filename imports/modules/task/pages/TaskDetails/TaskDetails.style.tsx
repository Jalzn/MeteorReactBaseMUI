import { ElementType } from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import { sysSizing } from '../../../../ui/materialui/styles';
import { SysSectionPaddingXY } from '../../../../ui/layoutComponents/sysLayoutComponents';

interface ITaskDetailsViewStyled {
	Container: ElementType<BoxProps>;
	Header: ElementType<BoxProps>;
	Body: ElementType<BoxProps>;
	Footer: ElementType<BoxProps>;
	FormColumn: ElementType<BoxProps>;
}

export const TaskDetailsViewStyled: ITaskDetailsViewStyled = {
	Container: styled(SysSectionPaddingXY)(() => ({
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '100%',
		gap: sysSizing.spacingFixedLg
	})),
	Header: styled(Box)({
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	}),
	Body: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '100%',
		gap: '64px',
		[theme.breakpoints.down('md')]: {
			flexDirection: 'column-reverse',
			gap: sysSizing.spacingFixedMd
		}
	})),
	Footer: styled(Box)({
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
		gap: sysSizing.spacingRemMd,
		marginTop: 'auto'
	}),
	FormColumn: styled(Box)({
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		gap: sysSizing.spacingFixedLg
	})
};
