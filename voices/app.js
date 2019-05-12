const express = require('express')
const app = express()
const port = 3031;
const routes = require('./routes');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const homeHTML = `
<html><body>
  <div>Endpoints</div>
  <div>
    <a href="/voices">/voices</a>
  </div>
  <div>
    <a href="/audioeffects">/audioeffects</a>
  </div>
  <div>
    <br/>
    Example of playing:
    <ul>
      <li>
        Generic (play=____; e.g. play=Hello There ):<br/><a href="/play?text=Hello There">/play?text=Hello There</a>
      </li>
      <li>
        Different Voice (voice=______; e.g. voice=dfki-spike-hsmm ):<br/>
        <a href="/play?text=Hello There&voice=dfki-spike-hsmm">/play?text=Hello There&voice=dfki-spike-hsmm</a>
      </li>
  </div>
  </body>
`

app.get('/', (req, res) => res.send(homeHTML))

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

// API routes
app.get('/voices', [routes.getVoices])
app.get('/audioeffects', [routes.getAudioEffects])

// testing routes
app.get("/testTime", [routes.testTime]);

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
const requestTimeoutDur = 5 * 60 * 1000; // 5 mins
server.timeout = requestTimeoutDur;