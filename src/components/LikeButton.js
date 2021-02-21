import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import MyPopup from './MyPopup';

function LikeButton({ post: { likeCount, likes, id }, user }) {
	const [liked, setLiked] = useState(false);
	useEffect(() => {
		if (user && likes.find((e) => e.email === user.email)) {
			setLiked(true);
		} else {
			setLiked(false);
		}
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		onError(error) {
			console.error(error);
		},
		variables: { postId: id },
	});

	const likeButton = user ? (
		liked ? (
			<Button color="pink">
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="pink" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button as={Link} to="/login" color="pink" basic>
			<Icon name="heart" />
		</Button>
	);

	return (
		<MyPopup content={liked ? 'Unlike' : 'Like'}>
			<Button as="div" labelPosition="right" onClick={likePost}>
				{likeButton}
				<Label basic color="pink" pointing="left">
					{likeCount}
				</Label>
			</Button>
		</MyPopup>
	);
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				email
			}
			likeCount
		}
	}
`;

export default LikeButton;
