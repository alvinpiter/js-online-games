import React from 'react';
import HomePage from './components/HomePage'
import RoomPage from './components/RoomPage'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/tic-tac-toe/:roomID" component={RoomPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
}

export default App;
