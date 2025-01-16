import './index.css';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { store } from './Redux/Store.js';
import App from './App.jsx';
import { routes } from './routes.jsx';

const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
