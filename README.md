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

    
### Build the UI

You need a fairly modern version of node.js for this.

    cd boss-ui
    npm install && npm run build
    
### Install redis-server
    brew install redis
    
In another window, run:

    redis-server

### Install consul

Download consul from https://www.consul.io/downloads.html, verify the checksums, and unzip.
In another window:

    ./consul agent -server -ui -data-dir consul-data -bootstrap=1
    
You can browse the ui at http://localhost:8500.

### Seed data

    python seed_dev_data.py

### Run boss

    # get javascript library 
    curl -O https://cdnjs.cloudflare.com/ajax/libs/svg.js/2.7.1/svg.js

    python boss.py
    
Open http://localhost:8081 in your browser window.

### Simulate motion detected:
    Connect to tunnel: 
    ssh-add -t 72000
    ssh-add -K ~/.ssh/id_rsa
    ssh-add -t 72000 $HOME/.ssh/ajcom
    ssh -J tunnel@192.241.228.33 127.0.0.1 -p 2212 -l jenkins -D 1080

    redis-cli publish the-heads-events '{"type":"motion-detected","installation":"office","data":{"cameraName":"camera0","position":17}}'
