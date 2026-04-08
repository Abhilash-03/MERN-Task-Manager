import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux'
import ThemeProvider from './components/ThemeProvider';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
    <Router>
       <Routes>
        <Route path='/*' element={<App /> }></Route>
       </Routes>
    </Router>
    </ThemeProvider>
    </Provider>
    </PersistGate>
  </React.StrictMode>
);

