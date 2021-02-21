import { Container } from 'semantic-ui-react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
} from 'react-router-dom';

import { AuthProvider } from './context/auth';

import AuthRoute from './utils/AuthRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import SinglePost from './pages/SinglePost';

import MenuBar from './components/MenuBar';

function App() {
	return (
		<AuthProvider>
			<Container>
				<Router>
					<MenuBar />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route
							exact
							path="/posts/:postId"
							component={SinglePost}
						/>
						<AuthRoute exact path="/login" component={Login} />
						<AuthRoute exact path="/register" component={Register} />
						<Route path="*" component={NotFound} />
					</Switch>
				</Router>
			</Container>
		</AuthProvider>
	);
}

export default App;
