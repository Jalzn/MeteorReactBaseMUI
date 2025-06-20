import React, { useContext, useEffect } from 'react';
import SignInStyles from './signInStyles';
import { useNavigate } from 'react-router-dom';
import SysTextField from '../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysForm from '../../../ui/components/sysForm/sysForm';
import SysFormButton from '../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { signInSchema } from './signinsch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

const SignInPage: React.FC = () => {
	const { showNotification } = useContext(AppLayoutContext);
	const { user, signIn } = useContext<IAuthContext>(AuthContext);
	const navigate = useNavigate();
	const { Container, Header, Content, FormContainer, FormWrapper, Footer } = SignInStyles;

	const handleSubmit = ({ email, password }: { email: string; password: string }) => {
		signIn(email, password, (err) => {
			if (err) {
				showNotification({
					type: 'error',
					title: 'Erro ao tentar logar',
					message: 'Email ou senha inválidos'
				});
			}
			navigate('/');
		});
	};

	const handleForgotPassword = () => navigate('/password-recovery');
	const handleSignUp = () => navigate('/signup');

	useEffect(() => {
		if (user) navigate('/');
	}, [user]);

	return (
		<Container>
			<Content>
				<Header>
					<Typography variant="h1">ToDo List</Typography>
					<Typography variant="h5">Boas-vindas a sua lista de tarefas.</Typography>
					<Typography variant="h5">Insira seu e-mail e senha para efetuar o login</Typography>
				</Header>
				<FormContainer>
					<SysForm schema={signInSchema} onSubmit={handleSubmit} debugAlerts={false}>
						<FormWrapper>
							<SysTextField name="email" label="Email" fullWidth placeholder="Digite seu email" />
							<SysTextField label="Senha" fullWidth name="password" placeholder="Digite sua senha" type="password" />
							<SysFormButton
								sx={{ alignSelf: 'end' }}
								variant="contained"
								color="primary"
								endIcon={<SysIcon name={'arrowForward'} />}>
								Entrar
							</SysFormButton>
							<Box />
						</FormWrapper>
					</SysForm>
				</FormContainer>
				<Footer>
					<Button variant="text" sx={{ alignSelf: 'center' }} onClick={handleForgotPassword}>
						<Typography color="white">Esqueci minha senha</Typography>
					</Button>
					<Button variant="text" sx={{ alignSelf: 'center' }} onClick={handleSignUp}>
						<Typography color="white">Novo por aqui? Cadastre-se</Typography>
					</Button>
				</Footer>
			</Content>
		</Container>
	);
};

export default SignInPage;
