import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';

import { useForm } from '../utils/hooks';

function Register(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});
	const { onChange, onSubmit, values } = useForm(registerUser, {
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [addUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
		update(_, result) {
			context.login(result.data.register);
			props.history.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	function registerUser() {
		setErrors({});
		addUser();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Register</h1>
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
				<Form.Input
					value={values.confirmPassword}
					onChange={onChange}
					label="Confirm password"
					placeholder="Confirm password"
					name="confirmPassword"
					type="password"
					error={!!errors.confirmPassword}
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

const REGISTER_USER_MUTATION = gql`
	mutation register(
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			token
			id
			email
			createdAt
		}
	}
`;

export default Register;
