import { useContext, useState, useRef } from 'react';
import { gql } from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
	Icon,
	Button,
	Card,
	Grid,
	Image,
	Label,
	Form,
} from 'semantic-ui-react';
import moment from 'moment';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

import { AuthContext } from '../context/auth';

function SinglePost(props) {
	const [comment, setComment] = useState('');
	const { user } = useContext(AuthContext);
	const commentInputRef = useRef(null);
	const postId = props.match.params.postId;

	const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
		update() {
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	function deletePostCallback() {
		props.history.push('/');
	}

	let postMarkup;

	if (!getPost) {
		postMarkup = <p>Loading post...</p>;
	} else {
		const {
			id,
			email,
			body,
			createdAt,
			comments,
			likes,
			likeCount,
			commentCount,
		} = getPost;
		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							size="small"
							floated="right"
							src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255634-stock-illustration-avatar-icon-male-profile-gray.jpg"
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{email}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton
									user={user}
									post={{ id, likeCount, likes }}
								/>
								<Button as="div" labelPosition="right">
									<Button basic color="blue">
										<Icon name="comments" />
									</Button>
									<Label basic color="blue" pointing="left">
										{commentCount}
									</Label>
								</Button>
								{user && user.email === email && (
									<DeleteButton
										postId={postId}
										callback={deletePostCallback}
									/>
								)}
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment</p>
									<Form onSubmit={createComment}>
										<div className="ui action input fluid">
											<input
												onChange={(e) => setComment(e.target.value)}
												name="comment"
												value={comment}
												type="text"
												placeholder="Comment..."
												ref={commentInputRef}
											/>
											<button
												type="submit"
												className="ui button teal"
												disabled={!comment}
											>
												Submit
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map((comment) => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.email === comment.email && (
										<DeleteButton
											postId={id}
											commentId={comment.id}
										/>
									)}
									<Card.Header>{comment.email}</Card.Header>
									<Card.Meta>
										{moment(comment.createdAt).fromNow()}
									</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}

	return postMarkup;
}

const CREATE_COMMENT_MUTATION = gql`
	mutation createComment($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			commentCount
			comments {
				body
				id
				createdAt
				email
			}
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query getPost($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			email
			likeCount
			likes {
				email
			}
			commentCount
			comments {
				id
				email
				createdAt
				body
			}
		}
	}
`;

export default SinglePost;
