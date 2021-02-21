import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../utils/hooks';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

function PostForm() {
	const [error, setError] = useState('');
	const { onChange, onSubmit, values } = useForm(addPost, {
		body: '',
	});

	const [createPost, { loading }] = useMutation(
		CREATE_POST_MUTATION,
		{
			update(proxy, result) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY,
				});
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: {
						getPosts: [result.data.createPost, ...data.getPosts],
					},
				});
				values.body = '';
			},
			variables: values,
			onError(error) {
				console.error(error);
				setError(error.graphQLErrors[0].message);
			},
		}
	);

	function addPost() {
		setError('');
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						value={values.body}
						placeholder="New post..."
						name="body"
						onChange={onChange}
						error={!!error}
					/>
					<Button disabled={!values.body} type="submit" color="teal">
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div
					className="ui error message"
					style={{ marginBottom: 18 }}
				>
					<ul className="list">
						<li>{error}</li>
					</ul>
				</div>
			)}
		</>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			email
			createdAt
			likeCount
			commentCount
			comments {
				id
				createdAt
				email
				body
			}
			likes {
				id
				email
				createdAt
			}
		}
	}
`;

export default PostForm;
