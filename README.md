# The Heads


## How to setup a dev environment for boss

### Get the source
    git clone git2@git01:git/heads
    
    brew install python3
    pip3 install virtualenv
    
    virtualenv -p python3 env
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

    ./consul agent -dev -ui
    
You can browse the ui at http://localhost:8500. No data is saved.

### Seed data

Coming soon!

### Run boss

    python boss.py
    
Open http://localhost:8081 in your browser window.
