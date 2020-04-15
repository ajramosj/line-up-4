# line-up-4

A 2-player game based on `express` (server) and `angular` (client), communicating via `socket.io`. Both clients handle data processing and render the board independently, using the server to communicate with each other (no anti-cheating techniques are applied). A new ID is issued to each player to play a new game.

The following commands have been used to build the app skeleton:

* Client
```
npm install -g @angular/cli
ng new app
cd app
rm -rf .git
ng generate component dashboard
ng generate component home
ng generate component play
ng generate component wait
ng generate service http
ng add @angular/material
ng build
ng serve --open
```
* Server
```
npm init --yes
npm install body-parser
npm install dotenv
npm install express
npm install socket.io
npm install --save-dev nodemon
```

Create a `.env` text file in the `server` with the port number (e.g., `PORT = 3000`) and run the following commands from the `client` folder to start the app locally:

```
cd app
npm install
ng build
mv dist ../../server
cd ../../server
npm install --only=prod
npm start 
```

> `angular` must be installed globally in order to build the app: `npm install -g @angular/cli`