import React, { useContext } from 'react';
import { Grid, Transition } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

function Home() {
	const { user } = useContext(AuthContext);
	const { loading, data: { getPosts: posts } = {} } = useQuery(
		FETCH_POSTS_QUERY
	);

	return (
		<Grid columns={3}>
			<Grid.Row>
				<h1 className="text-center">Все записи</h1>
			</Grid.Row>
			<Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}
				{loading ? (
					<div>loading...</div>
				) : posts ? (
					<Transition.Group>
						{posts.map((post) => (
							<Grid.Column key={post.id} style={{ marginBottom: 16 }}>
								<PostCard post={post} />
							</Grid.Column>
						))}
					</Transition.Group>
				) : (
					<div>Нет записей</div>
				)}
			</Grid.Row>
		</Grid>
	);
}

export default Home;
