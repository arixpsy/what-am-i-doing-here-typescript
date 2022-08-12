# what-am-i-doing-here-typescript
 Typescript refactor of my first phaser game

# Building

# Deployment (Heroku)
https://github.com/lstoll/heroku-buildpack-monorepo
https://github.com/heroku/heroku-buildpack-multi-procfile

```bash

# Deploying Socket Backend
heroku create -a waidh-be
heroku buildpacks:add -a waidh-be heroku-community/multi-procfile
heroku buildpacks:set -a waidh-be heroku/nodejs
heroku config:set -a waidh-be APP_BASE=waidh-be
git subtree push --prefix waidh-be heroku main
```