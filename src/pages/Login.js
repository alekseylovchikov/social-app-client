import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';

import { useForm } from '../utils/hooks';

function Login(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});
	const { onChange, onSubmit, values } = useForm(signIn, {
		email: '',
		password: '',
	});

	const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
		update(_, result) {
			context.login(result.data.login);
			props.history.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	function signIn() {
		setErrors({});
		loginUser();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Login</h1>
				<Form.Input
					value={values.email}
					onChange={onChange}
					label="Email"
					placeholder="Email"
					name="email"
					type="email"
					error={!!errors.email}
				/>
				<Form.Input
					value={values.password}
					onChange={onChange}
					label="Password"
					placeholder="Password"
					name="password"
					type="password"
					error={!!errors.password}
				/>
				<Button type="submit" primary>
					Submit
				</Button>
			</Form>
			{
				Object.keys(errors).length > 0 &&
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map(value => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			}
		</div>
	);
}

const LOGIN_USER_MUTATION = gql`
	mutation login($email: String!, $password: String!) {
		login(loginInput: { email: $email, password: $password }) {
			token
			id
			email
			createdAt
		}
	}
`;

export default Login;
