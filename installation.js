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


function main() {
    console.log("here we are");
    var svg = SVG('drawing').size('100%', '100%');

    var group = svg.group();

    var radius = 100;

    var position = [200, 300];

    var head = group.circle(0).radius(radius);
    // head.width(400);
    // head.height(300);
    // head.center(position[0], position[1]);

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

    group.move(position[0], position[1]);
    group.rotate(60);

}