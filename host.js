function call(port, path) {
    var host = window.location.hostname;
    var req = new XMLHttpRequest();
    req.addEventListener("load", function() {
        console.log("got", this.responseText);
    });
    req.open("GET", "http://" + host + ":" + port + path);
    req.send();
}

function find_zero() {
    call(8080, "/find_zero")
}

function rainbow() {
    call(8082, "/run/rainbow")
}

function lowred() {
    call(8082, "/run/lowred")
}

function bounce() {
    call(8082, "/run/bounce")
}

function off() {
    call(8082, "/run/off")
}

function restartHost() {
    call(80, "/restart-host")
}

function shutdownHost() {
    call(80, "/shutdown-host?pw=1199")
}