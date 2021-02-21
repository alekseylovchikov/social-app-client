import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
	query {
		getPosts {
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
