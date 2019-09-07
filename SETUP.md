# The Heads


## How to setup a dev environment for boss

### Get the source
    git clone git2@git01:git/heads
    cd heads
    
    brew install python3
    pip3 install virtualenv
    
    python3 -m virtualenv -p python3 env
    source env/bin/activate
    pip install -r requirements.txt
    
Note that you may get an error `Failed building wheel for spidev`. 
This is ok.

### Some building 
gcc -O3 -shared trace.c -o trace.so
brew install go
# brew upgrade go (if necessary)
brew install opencv (3.4.3)
brew install pkg-config
cd camera; go build .; cd ..
cd boss; go build .; cd..
./boss/boss (to start boss if you need to)

Misc notes:
gcc -O3 -shared trace.c -o trace.so
 7604  python run_dev.py
 7605  cd camera
 7606  ls
 7607  brew upgrade go
 7608  brew install go
 7609  go build .
 7610  brew install opencv
 7611  brew install pkg-config
 7612  go build .
 7613  brew install opencv@3.4.3
 7614  brew install opencv@3.4.4
 7615  brew install opencv@3.4.6
 7616  brew install opencv@3.4
 7617  brew install opencv@
 7618  brew install opencv@3
 7619  go build .
 7620  export PKG_CONFIG_PATH=/usr/local/Cellar/opencv/3.4.3/lib
 7621  go build .
 7622  cd /usr/local/Cellar/opencv/
 7623  ls
 7624  brew link opencv@3
 7625  brew link opencv@3 --force
 7626  brew link opencv@3 --force --overwrite

    
### Build the UI

You need a fairly modern version of node.js for this.

    cd boss-ui
    npm install && npm run build
    
### Install redis-server
    brew install redis
    
In another window, run:

    redis-server

You can view the redis monitor with:
    redis-cli monitor

### Install consul

Download consul from https://www.consul.io/downloads.html, verify the checksums, and unzip.
In another window:
    ./consul agent -server -ui -data-dir consul-data -bootstrap=1 --bind 127.0.0.1
    or in dev
    ./consul agent -server -ui -data-dir consul-data -bootstrap=1 --bind 127.0.0.1 -dev
    or 
    ./consul agent -server -ui --bind 127.0.0.1 -dev
    
You can browse the ui at http://localhost:8500.

### Seed data

    python seed_dev_data.py

### Run boss

    # get javascript library 
    curl -O https://cdnjs.cloudflare.com/ajax/libs/svg.js/2.7.1/svg.js

    python run_dev.py

    (previously: python boss.py)
    
Open http://localhost:8000 in your browser window.
For Boss: Open http://localhost:8081 in your browser window.

### NOTE: to connect to the boxes from my machine use:
    ssh-add -K ~/.ssh/id_heads

### Simulate motion detected:
    Connect to tunnel: 
    ssh-add -t 72000
    ssh-add -K ~/.ssh/id_rsa
    ssh-add -t 72000 $HOME/.ssh/ajcom

    To connect to tunnel:
    ssh -J tunnel@192.241.228.33 127.0.0.1 -p 2212 -l jenkins -D 1080

    In Firefox: settings search for proxy. do proxy setup for manual.
    Then can visit in firefox: boss.service.consul:8081

    redis-cli publish the-heads-events '{"type":"motion-detected","installation":"office","data":{"cameraName":"camera0","position":17}}'
