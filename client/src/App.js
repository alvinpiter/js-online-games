import React from 'react';
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/tic-tac-toe/:roomID"
          render={props => <RoomPage gameCode="TICTACTOE" roomID={props.match.params.roomID} />}
        />

        <Route
          path="/reversi/:roomID"
          render={props => <RoomPage gameCode="REVERSI" roomID={props.match.params.roomID} />}
        />

        <Route
          path="/sudoku/:roomID"
          render={props => <RoomPage gameCode="SUDOKU" roomID={props.match.params.roomID} />}
        />

        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
}

export default App;
