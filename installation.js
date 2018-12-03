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
        }
    ]
};


function draw_stand(parent, w, h, stand) {
    var radius = .20;

    var head = parent.circle(0).radius(radius);

    head.attr({
        fill: '#f06',
        stroke: '#000',
        "stroke-width": 0.020
    });
    // head.height(300);
    // console.log(head.radius())

    var line = parent.line(
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
    });
}

function main() {
    var w = 600;
    var h = 600;

    console.log("here we are");
    var svg = SVG('drawing').size(w, h);
    svg.rect(600, 600).attr({fill: "sandybrown"});

    data.stands.forEach(function (stand) {
        var parent = svg.group();
        var scale = 100;
        parent.dmove(stand.pos.x * scale, stand.pos.y * scale);
        parent.dmove(w / 2, h / 2);
        parent.scale(100, 100, 0, 0);
        parent.rotate(-stand.rot, 0, 0);
        draw_stand(parent, w, h, stand);
    });

    svg.line(w / 2, 0, w / 2, h).stroke({width: 1});
    svg.line(0, h / 2, w, h / 2).stroke({width: 1});
}