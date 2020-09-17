# JSOG

Link: http://jsog.herokuapp.com/

JSOG (JavaScript Online Games) is a web application where you can play games with your friend(s). There are currently 3 games that you can play, Tic-Tac-Toe, Reversi, and Sudoku. I'll be adding more games later (if I have time), like Tetris. 

## Games

### Tic-Tac-Toe
The rule is exactly the same with traditional Tic-Tac-Toe
![Tic-Tac-Toe](https://github.com/alvinpiter/js-online-games/blob/master/screenshots/tictactoe.png)

### Reversi
The rule is exactly the same with traditional Reversi
![Reversi](https://github.com/alvinpiter/js-online-games/blob/master/screenshots/reversi.png)

### Sudoku
The rule is the same with traditional Sudoku, except now you race against your friends and you only have one shot to guess the number in each cell. The one-shot rule is there to prevent user doing trial and error.
![Sudoku](https://github.com/alvinpiter/js-online-games/blob/master/screenshots/sudoku.png)

## Development
Running the server:
```
cd server
npm start
```

Running the client:
```
cd client
npm start
```

## Deployment

### Server
```
# Create heroku repository
heroku create jsog-server --buildpack heroku/nodejs

# Add origin
git remote add jsog-server https://git.heroku.com/jsog-server.git

# Deploy to heroku
git subtree push --prefix server jsog-server master
```

### Client

```
# Create heroku repository
heroku create jsog -b https://github.com/mars/create-react-app-buildpack.git

# Add origin
git remote add jsog https://git.heroku.com/jsog.git

# Deploy to heroku
git subtree push --prefix client jsog master
```
