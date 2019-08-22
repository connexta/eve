import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducers from './reducers'
//import dev tools extension
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(rootReducers,
  composeWithDevTools()
  );

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('iamroot')
);