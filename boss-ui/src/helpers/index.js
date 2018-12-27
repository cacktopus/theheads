// From: https://www.npmjs.com/package/transformation-matrix
import { scale, translate, compose, applyToPoint } from 'transformation-matrix';
// import { scale, rotate, translate, compose, applyToPoint } from 'transformation-matrix';

// E.g.: rotateVector([0,1], 90); for point 0,1 rotate by 90degrees.
export const rotateVector = (vec, ang, origin) => {
    ang = -ang * (Math.PI / 180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);

    if (!origin) {
        origin = { x: 0, y: 0 }
    }

    // Only rotate from the origin
    const vecFromOrg = { x: vec.x - origin.x, y: vec.y - origin.y };

    const rotatedPos = {
        x: Math.round(10000 * (vecFromOrg.x * cos - vecFromOrg.y * sin)) / 10000,
        y: Math.round(10000 * (vecFromOrg.x * sin + vecFromOrg.y * cos)) / 10000
        // x: Math.round(10000*(vec.x * cos - vec.y * sin))/10000,
        // y: Math.round(10000*(vec.x * sin + vec.y * cos))/10000
    };

    return {
        x: rotatedPos.x + origin.x,
        y: rotatedPos.y + origin.y
    }

    // NOTE: below is using arrays instead of pos objects
    // ang = -ang * (Math.PI/180);
    // var cos = Math.cos(ang);
    // var sin = Math.sin(ang);
    // return new Array(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
};

console.log("FIguRE OUT THE DECODE / ENCODE... in progress with... ");

export const encodePos = (menu, pos) => {
    const scaleVal = menu.get("scale");
    const translateX = parseFloat(menu.getIn(["translate","x"]));
    const translateY = parseFloat(menu.getIn(["translate","y"]));

    let matrix = compose(
        
        scale(1/scaleVal, -1/scaleVal),
        // rotate(Math.PI/2),
        translate(-1*translateX, -1*translateY),
    );

    const newPos = applyToPoint(matrix, pos);

    return newPos;
}

export const decodePos = (menu, pos) => {
    const scaleVal = menu.get("scale");
    const translateX = parseFloat(menu.getIn(["translate","x"]));
    const translateY = parseFloat(menu.getIn(["translate","y"]));

    let matrix = compose(
        translate(translateX, translateY),
        // rotate(-1*Math.PI/2),
        scale(scaleVal, -1*scaleVal)
    );

    const newPos = applyToPoint(matrix, pos);

    return newPos;
}

export const encodePosScale = (menu, pos) => {
    const scaleVal = menu.get("scale");

    let matrix = compose(
        scale(scaleVal, -1*scaleVal)
    );

    const newPos = applyToPoint(matrix, pos);

    return newPos;
}

export const decodePosScale = (menu, pos) => {
    const scaleVal = menu.get("scale");

    let matrix = compose(
        scale(1/scaleVal, -1/scaleVal)
    );

    const newPos = applyToPoint(matrix, pos);

    return newPos;
}

export const encodeRot = (rot) => {
    return -1 * rot;
}

export const decodeRot = (rot) => {
    return -1 * rot;
}

// Cookies
export const setCookie = (name,value,days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
export const eraseCookie = (name) => {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}