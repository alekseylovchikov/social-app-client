import { useState } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY } from '../utils/graphql';
import MyPopup from './MyPopup';

function DeleteButton({ postId, callback, commentId }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId
		? DELETE_COMMENT_MUTATION
		: DELETE_POST_MUTATION;

	const [deletePostOrMutation] = useMutation(mutation, {
		variables: {
			postId,
			commentId,
		},
		update(proxy) {
			if (!commentId) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY,
				});
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: {
						getPosts: data.getPosts.filter((el) => el.id !== postId),
					},
				});
			}

			setConfirmOpen(false);
			if (callback) callback();
		},
	});

	return (
		<>
			<MyPopup content={`Delete ${!commentId ? 'post' : 'comment'}`}>
				<Button
					color="red"
					floated="right"
					basic
					onClick={() => {
						setConfirmOpen(true);
					}}
					as="div"
				>
					<Icon
						name="trash alternate outline"
						style={{ margin: 0 }}
					/>
				</Button>
			</MyPopup>
			<Confirm
				open={confirmOpen}
				onConfirm={deletePostOrMutation}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				email
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default DeleteButton;
