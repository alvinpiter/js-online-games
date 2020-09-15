### Server deployment

```
# Create heroku repository
heroku create jsog-server --buildpack heroku/nodejs

# Add origin
git remote add jsog-server https://git.heroku.com/jsog-server.git

# Deploy to heroku
git subtree push --prefix server jsog-server master
```

### Client deployment

```
# Create heroku repository
heroku create jsog -b https://github.com/mars/create-react-app-buildpack.git

# Add origin
git remote add jsog https://git.heroku.com/jsog.git

# Deploy to heroku
git subtree push --prefix client jsog master
```
