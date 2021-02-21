import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'semantic-ui-css/semantic.min.css';

import reportWebVitals from './reportWebVitals';
import ApolloProvider from './ApolloProvider';
import './index.css';

moment.locale('ru');

ReactDOM.render(
  // <React.StrictMode>
  ApolloProvider,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
