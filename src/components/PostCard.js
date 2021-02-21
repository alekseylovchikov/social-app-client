import React, { useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, Icon, Label, Button, Image } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from './MyPopup';

function PostCard({ post }) {
	const {
		email,
		body,
		createdAt,
		likeCount,
		commentCount,
		likes,
		id,
	} = post;
	const { user } = useContext(AuthContext);

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255634-stock-illustration-avatar-icon-male-profile-gray.jpg"
				/>
				<Card.Header>{email}</Card.Header>
				<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={{ id, likes, likeCount }} />
				<MyPopup content="Comment on post">
					<Button as={Link} labelPosition="right" to={`/posts/${id}`}>
						<Button color="blue" basic>
							<Icon name="comments" />
						</Button>
						<Label basic color="blue" pointing="left">
							{commentCount}
						</Label>
					</Button>
				</MyPopup>
				{user && user.email === email && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	);
}

export default PostCard;
