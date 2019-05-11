const express = require('express')
const app = express()
const port = 3031;
const routes = require('./routes');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.get('/', (req, res) => res.send('Hello World!'))

app.get('/process', [routes.processSound])
app.post('/process', [routes.processSound])

app.get('/play', [routes.playSound])
app.post('/play', [routes.playSound])

// app.get('/killAll', [routes.killSound])
// app.get('/stop', [routes.stopSound])

app.get('/stopAll', [routes.stopAllSounds])
app.get('/stopAllAndPlay', [routes.stopAllSoundsAndPlaySound])

app.get('/audio', (req, res) => {
    console.log('hji');
    res.send('playing');
})

// Testing routes
app.get('/getVoices', [routes.getVoices])

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
