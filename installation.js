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
            "rot": 300
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


function draw_stand(svg, w, h, x, y) {
    var group = svg.group();

    var radius = 20;

    var head = group.circle(0).radius(radius);

    head.attr({
        fill: '#f06',
        stroke: '#000'
    });
    // head.height(300);
    // console.log(head.radius())

    var line = group.line(
        0,
        0,
        radius,
        0
    ).stroke({width: 3});

    var scale = 100;

    console.log(data.stands[0].pos.x);

    group.dmove(w / 2, h / 2);
    group.dmove(x * scale, y * scale);

    group.rotate(-60);
}

function main() {
    var w = 600;
    var h = 600;

    console.log("here we are");
    var svg = SVG('drawing').size(w, h);
    svg.rect(600, 600).attr({fill: "sandybrown"});

    data.stands.forEach(function (stand) {
        draw_stand(svg, w, h, stand.pos.x, stand.pos.y);
    });
}