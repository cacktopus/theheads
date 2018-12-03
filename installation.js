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
}


function main() {
    console.log("here we are");
    var svg = SVG('drawing').size('100%', '100%');
    var head = svg.circle(100);
    // head.width(400);
    // head.height(300);
    head.x(200);
    head.y(50);

    head.attr({
        fill: '#f06',
        stroke: '#000'
    });
    // head.height(300);

    svg.line(
        head.cx(),
        head.cy(),
        head.cx() + head.width() / 2,
        head.cy(),
    ).stroke({width: 3});
}