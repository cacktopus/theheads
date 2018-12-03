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


function draw_stand(svg, w, h, stand) {
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

    var fov = 60;
    var fov_x = 300;
    var fov_y = fov_x * Math.tan(fov * Math.PI / 180 / 2);

    group.polygon([0, 0, fov_x, fov_y, fov_x, -fov_y]).attr({
        'fill': "lightblue",
        'fill-opacity': 0.5
    });

    group.line([0, 0, fov_x, fov_y]).stroke({width: 1, color: "darkblue"});
    group.line([0, 0, fov_x, -fov_y]).stroke({width: 1, color: "darkblue"});

    group.dmove(w / 2, h / 2);
    group.dmove(stand.pos.x * scale, stand.pos.y * scale);
    group.rotate(-stand.rot, 0, 0);
}

function main() {
    var w = 600;
    var h = 600;

    console.log("here we are");
    var svg = SVG('drawing').size(w, h);
    svg.rect(600, 600).attr({fill: "sandybrown"});

    data.stands.forEach(function (stand) {
        draw_stand(svg, w, h, stand);
    });

    svg.line(w / 2, 0, w / 2, h).stroke({width: 1});
    svg.line(0, h / 2, w, h / 2).stroke({width: 1});
}