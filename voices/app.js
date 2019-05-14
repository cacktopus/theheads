const express = require('express');
const app = express();
const port = 3031;
const routes = require('./routes');

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const homeHTML = `
<html>
<head> 
<style>
li { padding-bottom: 15;}
</style>
</head>
<body>
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
        <a href="/play?text=tick">/play?tick</a>
      </li>
      <li>
        Different Voice (voice=______; e.g. voice=dfki-spike-hsmm ):<br/>
        <a href="/play?text=Hello There&voice=dfki-spike-hsmm">/play?text=Hello There<b>&voice=dfki-spike-hsmm</b></a>
      </li>
      <li>
        Using effects (See: <a href="/audioeffect">/audioeffects</a> for list of effects).<br/>
        Then use the effect <b>name</b> with a value. E.g. For <b>F0AddM</b> use "...&<b>F0Add</b>=<b>95</b>..." ):<br/>
        <a href="play?text=Hey! What are you doing! Should I ignore you! Why are you here?Who are you! What do you want! Stop that&F0Scale=2.0&F0Add=95">/play?text=Hey! What are you doing! Should I ignore you! Why are you here?Who are you! What do you want!<b>&F0Scale=2.0&F0Add=95</b></a><br/>
        <br/>
        You can experiment with effects <a href="#" id="marylink">here<a><br/><br/>

        <script>
          window.marylink = document.getElementById("marylink");
          marylink.href = "http://" + location.hostname + ":59125";
          marylink.innerHTML = "here (" + marylink.href + ")";
        </script>


      </li>

  </div>
  </body>
`;

app.get('/', (req, res) => res.send(homeHTML));

app.get('/process', [routes.processSound]);
app.post('/process', [routes.processSound]);

app.get('/play', [routes.playSound]);
app.post('/play', [routes.playSound]);

// app.get('/killAll', [routes.killSound])
// app.get('/stop', [routes.stopSound])

app.get('/stopAll', [routes.stopAllSounds]);
app.get('/stopAllAndPlay', [routes.stopAllSoundsAndPlaySound]);

app.get('/audio', (req, res) => {
    console.log('hji');
    res.send('playing');
});

// API routes
app.get('/voices', [routes.getVoices]);
app.get('/audioeffects', [routes.getAudioEffects]);

// testing routes
app.get("/testTime", [routes.testTime]);

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
const requestTimeoutDur = 5 * 60 * 1000; // 5 mins
server.timeout = requestTimeoutDur;