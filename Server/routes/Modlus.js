var express = require('express');
var modrouter = express.Router();

// calculartion of Modullus 10 - startt
/*
 * JavaScript implementation of the Luhn algorithm, with calculation and validation functions
 */

/* luhn_checksum
 * Implement the Luhn algorithm to calculate the Luhn check digit.
 * Return the check digit.
 */
function luhn_checksum(code) {
    console.log("code = " + code);
    const alphstr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const wght = "2765432";
    var len = code.length;
    var step1 = 0;
    var wghtcnt = 0;


    for (i = 1; i < len - 1; i++) {
        // console.log('code.charAt(' + wghtcnt + 1 + '))' + code.charAt(wghtcnt + 1) + 'wght.charAt(wghtcnt)) = ' + parseInt(wght.charAt(wghtcnt)))
        step1 = parseInt(step1) + (parseInt(code.charAt(wghtcnt + 1)) * parseInt(wght.charAt(wghtcnt)))
        // console.log('wghtcnt = ' + parseInt(wght.charAt(wghtcnt)) + "        step1 =   " + step1)
        wghtcnt = wghtcnt + 1
    }
    // return step1 % 11
    //}

    var offset = (code.charAt(0) == "T" || code.charAt(0) == "G") ? 4 : 0;
    //console.log("offset = " + offset)
    //var temp = (offset + weight) % 11;
    var temp = (offset + step1) % 11;
    var st = Array("J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A");
    var fg = Array("X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K");
    var theAlpha;
    if (code.charAt(0) == "S" || code.charAt(0) == "T") {
        theAlpha = st[temp];
    } else if (code.charAt(0) == "F" || code.charAt(0) == "G") {
        theAlpha = fg[temp];
    }
    console.log("theAlpha = " + theAlpha)
    return theAlpha;
}


// var step2 = step1 % 11;
// var step3 = 11 - step2;
// console.log(step3)
/*  var code = ' ';* /
function getcd(code) {
    switch (11 - code) {
        case 1: code = 'A'; break;
        case 2: code = 'B'; break;
        case 3: code = 'C'; break;
        case 4: code = 'D'; break;
        case 5: code = 'E'; break;
        case 6: code = 'F'; break;
        case 7: code = 'G'; break;
        case 8: code = 'H'; break;
        case 9: code = 'I'; break;
        case 10: code = 'Z'; break;
        case 11: code = 'J';
    }
    return code;
}


/* luhn_caclulate
 * Return a full code (including check digit), from the specified partial code (without check digit).
 */
module.exports.luhn_caclulate = function (partcode) {
    var checksum = luhn_checksum(partcode + '0')
    console.log("at calculate = " + checksum)
    //var chkapha = getcd(checksum);
    return checksum == 0 ? 0 : (partcode + checksum)
}
//alphstr.charAt((
/* luhn_validate
 * Return true if specified code (with check digit) is valid.
 */
module.exports.luhn_validate = function (fullcode) {
    //console.log("at validate = " + 
    if (luhn_checksum(fullcode) == fullcode.charAt(fullcode.length - 1)) {
        return true
    } else {
        return false
    }
}



/* var icArray = new Array(9);
for (i = 0; i < 9; i++) {
    icArray[i] = ic.charAt(i);
}
icArray[1] *= 2;
icArray[2] *= 7;
icArray[3] *= 6;
icArray[4] *= 5;
icArray[5] *= 4;
icArray[6] *= 3;
icArray[7] *= 2;
var weight = 0;
for (i = 1; i < 8; i++) {
    weight += parseInt(icArray[i]);
} */

/* var offset = (icArray[0] == "T" || icArray[0] == "G") ? 4 : 0;
var temp = (offset + weight) % 11;
var st = Array("J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A");
var fg = Array("X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K");
var theAlpha;
if (icArray[0] == "S" || icArray[0] == "T") {
    theAlpha = st[temp];
} else if (icArray[0] == "F" || icArray[0] == "G") {
    theAlpha = fg[temp];
}
return (icArray[8] == theAlpha);
} */







/* var parity = len % 2
var sum = 0
for (var i = len - 1; i >= 0; i--) {
    var d = parseInt(code.charAt(i))
    if (i % 2 == parity) { d *= 2 }
    if (d > 9) { d -= 9 }
    sum += d
}
return (sum % 10) - 1
} */

/* luhn_caclulate
 * Return a full code (including check digit), from the specified partial code (without check digit).
 * /
module.exports.luhn_caclulate = function (partcode) {
    var checksum = luhn_checksum(partcode + "0")
    console.log("at calculate" + (10 - checksum))
    return checksum == 0 ? 0 : 10 - checksum
}
//alphstr.charAt((
/* luhn_validate
 * Return true if specified code (with check digit) is valid.
 * /
module.exports.luhn_validate = function (fullcode) {
    //  console.log("at calculate" + checksum == 0 ? 0 : 10 - checksum)
    return luhn_checksum(fullcode) == 0
}

//  end of calculation of Modullus  10

//module.exports = modrouter;*/