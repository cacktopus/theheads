var data = {
    "name": "living-room",
    "stands": [
        {
            "cameras": [
                {
                    "description": "Raspberry Pi PiNoir Camera V2 Video Module",
                    "fov": 60,
                    "name": "camera0",
                    "pos": {
                        "x": 0.1,
                        "y": 0
                    },
                    "rot": 0
                }
            ],
            "heads": [
                {
                    "name": "head0",
                    "pos": {
                        "x": 0,
                        "y": 0
                    },
                    "rot": 0
                }
            ],
            "name": "stand0",
            "pos": {
                "x": -1.5,
                "y": 0
            },
            "rot": -85
        },
        {
            "cameras": [
                {
                    "description": "Raspberry Pi PiNoir Camera V2 Video Module",
                    "fov": 60,
                    "name": "camera1",
                    "pos": {
                        "x": 0.1,
                        "y": 0
                    },
                    "rot": 0
                }
            ],
            "heads": [
                {
                    "name": "head1",
                    "pos": {
                        "x": 0,
                        "y": 0
                    },
                    "rot": 0
                }
            ],
            "name": "stand1",
            "pos": {
                "x": 1.5,
                "y": 0
            },
            "rot": 240
        },
        {
            "cameras": [
                {
                    "description": "iMac built-in",
                    "fov": 70,
                    "name": "camera2",
                    "pos": {
                        "x": 0.1,
                        "y": 0
                    },
                    "rot": 0
                }
            ],
            "name": "desk0",
            "pos": {
                "x": 0,
                "y": 0
            },
            "rot": 270
        }
    ]
};


function draw_stand(scene, parent, w, h, stand) {
    var radius = .20;

    var head = parent.circle(0).radius(radius);

    head.attr({
        fill: '#f06',
        stroke: '#000',
        "stroke-width": 0.020
    });

    parent.line(
        0,
        0,
        radius,
        0
    ).stroke({width: 0.020});

    stand.cameras.forEach(function (camera) {
        var fov_x = 3;
        var fov_y = fov_x * Math.tan(camera.fov * Math.PI / 180 / 2);

        var g2 = parent.group();

        g2.polygon([0, 0, fov_x, fov_y, fov_x, -fov_y]).attr({
            'fill': "lightblue",
            'fill-opacity': 0.4
        });

        g2.line([0, 0, fov_x, fov_y]).stroke({width: 0.020, color: "darkblue"});
        g2.line([0, 0, fov_x, -fov_y]).stroke({width: 0.020, color: "darkblue"});

        g2.move(camera.pos.x, camera.pos.y);

        scene.cameras[camera.name] = g2;
    });
}


function setup_websocket(ws_port, scene) {
    var url = 'ws://' + window.location.hostname + ":" + ws_port + '/ws';
    console.log(url);
    var ws = new WebSocket(url);
    console.log(ws);

    ws.onmessage = function (event) {
        var msg = JSON.parse(event.data);
        console.log("WebSocket message received:", msg);
        if (msg.type === "motion-detected") {
            var cameraName = msg.data.cameraName;
            var camera = scene.cameras[cameraName];
            if (camera === undefined) {
                console.log("unknown camera: " + cameraName)
            } else {
                var ray = camera.line(0, 0, 5, 0).stroke({
                    width: 0.020,
                    color: "lightgreen",
                    opacity: 0.40
                });
                ray.rotate(msg.data.position, 0, 0);
                setTimeout(function () {
                    ray.remove();
                }, 5000);
            }
        } else if (msg.type === "draw") {
            if (msg.data.shape === "line") {
                var coords = msg.data.coords;
                console.log(coords);
                scene.root.line(coords[0], coords[1], coords[2], coords[3]).stroke({width: 0.020});
            }
        }
    };
}

function main(ws_port) {
    var w = 600;
    var h = 600;

    console.log("here we are");
    var svg = SVG('drawing').size(w, h);
    svg.rect(w, h).attr({fill: "sandybrown"});
    // svg.line(w / 2, 0, w / 2, h).stroke({width: 1});
    // svg.line(0, h / 2, w, h / 2).stroke({width: 1});

    var root = svg.group();
    var scale = 66;

    root.move(w / 2, 100);
    root.scale(scale, -scale, 0, 0);

    root.line(0, 0, 1, 0).stroke({width: 0.040, color: "red"});
    root.line(0, 0, 0, 1).stroke({width: 0.040, color: "lightgreen"});

    var scene = {
        cameras: {},
        root: root
    };

    data.stands.forEach(function (stand) {
        var parent = root.group();
        parent.dmove(stand.pos.x, stand.pos.y);
        parent.rotate(stand.rot, 0, 0);
        draw_stand(scene, parent, w, h, stand);
    });

    setup_websocket(ws_port, scene);
}