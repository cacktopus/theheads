function a() {
    var host = window.location.hostname;
    var port = window.location.port;

    console.log("here:", window.location.hostname)
    var req = new XMLHttpRequest();
    req.addEventListener("load", function() {
        console.log("got", this.responseText);
    });
    req.open("GET", "http://" + host + ":8080/find_zero");
    req.send();
}