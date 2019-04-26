# Marytts from: https://github.com/marytts/marytts

## Install / Running MaryTTS

Run `cd marytts-master` then `./gradlew run`  (or `gradlew.bat run` on Windows) to start a MaryTTS server.

Then access it at http://localhost:59125 using your web browser. This is also the endpoint that is used in the backend of the node server (see next section).

## Run the node server

Install npm if not already installed (https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/)

In another window, from root dir of this repo run `npm install` then `node app.js`

Access processing & playing sound from endpoints like: 
`http://localhost:3031/play?text=hello world`

or whichever hostname / ip address. E.g.:
`http://10.0.1.16:3031/play?text=hello world`

More routes:

To pre-process the sound:
`http://localhost:3031/process?text=hello world`

To stop all sounds (Because more than one phrase different phrases can be said at the same time):
`http://localhost:3031/stopAll`

To stop all and play new phrase
`http://localhost:3031/stopAllAndPlay?text=hello world`


## To dos

Figure out the callback endpoint to send a GET or POST request to let the requester know the playing is complete.