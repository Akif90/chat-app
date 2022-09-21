import React from 'react';
import { Switch } from 'react-router';
import SignIn from './pages/SignIn';
import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Switch>
      <PublicRoute path="/signin">
        <SignIn />
      </PublicRoute>
      {/* Private Route components is created
      so that we could create a functionality where
      home page is only accessible if we are signed in */}
      <PrivateRoute path="/">
        <Home />
      </PrivateRoute>
    </Switch>
  );
}

export default App;
