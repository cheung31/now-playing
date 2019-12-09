import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import routes from '../routes';

const initialData = window._INITIAL_DATA_;

hydrate(
  <BrowserRouter>
    <App routes={routes} initialData={initialData} />
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
