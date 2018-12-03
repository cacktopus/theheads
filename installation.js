function main() {
    console.log("here we are");
    var draw = SVG('drawing').size('100%', '100%');
    var rect = draw.rect(100, 300);
    rect.width(400);
    rect.height(300);
    rect.x(200);
    rect.y(50);
    rect.height(300);
}