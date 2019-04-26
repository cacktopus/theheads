const player = require('play-sound')(opts = {})
const axios = require('axios');

const http = require('http');
const fs = require('fs');

// Config related:
const OUTPUT_DIR = `outputs`;

// Holds audio 

// 
// [
//     {
//         text: "------",
//         filename : "o1.wav",
//         audio : player.play(fullFilena ...,
//         createdAt : new Date()
//         playedAt : new Data()
//         duration : _____ // Maybe we can calculate the estimated duration.
//     }
// ]
let _audioObjs = [];
let _audioCount = 0; // Iterating to help with filenaming.

function getFullFilename(filename) {
    return `${OUTPUT_DIR}/${filename}`;
}

// This plays it by the filename (not including the outputs directory.
// This returns the 'audio' object to be used to kill if necessary.
function playSoundByFilename(audioFilename, callback) {
    const fullFilename = getFullFilename(audioFilename);

    let audio = player.play(fullFilename, function (err) {
        if (err && !err.killed) {
            console.log(err);
            // throw err
        } else {
            if (callback && typeof callback === "function") {
                callback();
            }
        }
    })

    return audio;
}

// function play20HzSound() {
//     const filename20Hz1min = `20Hz-10-secs.mp3`;
//     const fullFilename20Hz1min = `${OUTPUT_DIR}/${filename20Hz1min}`;
//     player.playSoundByFilename(
//     const index = findAudioObjIndexByText(text);

//     return playSoundByIndex(index);
// }

function playSoundByText(text) {
    const index = findAudioObjIndexByText(text);

    return playSoundByIndex(index);
}

function playSoundByIndex(index) {
    if (index >= 0 && _audioObjs[index]) {
        const filename = _audioObjs[index].filename;

        // Top the audio if it was already playing.
        stopAudioForAudioObj(_audioObjs[index]);

        // Play the audio
        _audioObjs[index].audio = playSoundByFilename(filename);
        _audioObjs[index].playedAt = new Date();

        return true;
    } else {
        return false;
    }
}

function stopAudioForAudioObj(audioObj) {
    if (audioObj && audioObj.audio && audioObj.audio.kill) {
        audioObj.audio.kill();
        return true;
    } else {
        // Nothing to kill
        return false;
    }
}


//     {
//         text: "------",
//         filename : "-----",
//         audio : player.play(fullFilena ...,
//         createdAt : new Date()
//         playedAt : new Date()
//         duration : _____ // Maybe we can calculate the estimated duration.
//     }

function pushProcessedAudioObj({ text, filename }) {
    _audioObjs.push({
        text: text,
        filename: filename,
        // audio: undefined,    // Player.play(fullFilena ...,
        createdAt: new Date(),
        // playedAt: undefined,
        // duration: undefined     // Maybe we can calculate the estimated duration.
    });
}

function findAudioObjIndexByText(text) {
    return _audioObjs.findIndex(obj => {
        return obj.text == text
    });
}

// Delete from _audioObjs and delete cached file.
function deleteAudioObjByText(text) {
    const audioObjIndex = findAudioObjIndexByText(text);

    if (audioObjIndex >= 0) {
        // Delete object from _audioObjs
        const tempAudioObj = _audioObjs.splice(audioObjIndex, 1);

        stopAudioForAudioObj(tempAudioObj)

        if (tempAudioObj && tempAudioObj.filename) {
            const tempFullFilename = getFullFilename(tempAudioObj.filename);

            // Delete file on the file system
            fs.stat(tempFullFilename, function (err, stats) {
                console.log(stats);//here we got all information of file in stats variable

                if (err) {
                    return console.error(err);
                }

                fs.unlink(tempFullFilename, function (err) {
                    if (err) return console.log(err);
                    console.log('file deleted successfully');
                });
            });
        }
    }
}

function getTextFromReq(req) {
    let text;
    if (req.body && req.body.text) {
        text = req.body.text;
    } else if (req.query && req.query.text) {
        text = req.query.text;
    }

    return text;
}

function processSoundByText(text, callback) {
    return new Promise((resolve, reject) => {

        if (!text || text.trim() === "") {
            return reject("No Text");
        }

        // Encode the text to URL format and create the ttsUrl
        const encodedText = encodeURI(text);
        const ttsUrl = `http://localhost:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=${encodedText}&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=&VOICE_SELECTIONS=cmu-slt-hsmm%20en_US%20female%20hmm&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&VOICE=cmu-slt-hsmm&AUDIO=WAVE_FILE`; //' -H 'Accept-Encoding: identity;q=1, *;q=0' -H 'Accept-Language: en-US,en;q=0.9' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://localhost:59125/' -H 'Cookie: _vwo_uuid_v2=DF0E5749002F1F137183F1F57F736BB8B|c2687ce03409733a0ee25030c97c5f26; _ga=GA1.1.550767621.1548186935; __adroll_fpc=8630eb24b37309c255b50f8283059f89; menu-translateY=100; menu-scale=200; menu-translateX=300; CET-Client=s%3AIjkU0Ex_vxfWsHT4-cfxl16_WzxHPF_o.HwlO1MQKTC8cT7brNOXNYEAjsx7aak4w4xvh6WvQb3k; nim=right; __ar_v4=LOMMLKOQ7NES5CPYGS7IEX%3A20190228%3A22%7CNFSSXVP6CJA45FD4HL4PFU%3A20190228%3A22%7CYFMJVVFZZZGPTP4BWJVET6%3A20190228%3A22%7CMYKBYGUXU5EXTEDUE323FL%3A20190207%3A2; CET-Admin=s%3AJ2Ompl5xiHoqDb3RSfFTC_xvcakKiFVF.v6iJmxHTGsUq4e4uy1lz3IzBmI0CTVyvW5u1zvfK2zQ; _gid=GA1.1.267155174.1551688106' -H 'Connection: keep-alive' -H 'Range: bytes=0-' --compressed`;
        const newFilename = `${++_audioCount}.wav`;

        // Download and save the file.
        const file = fs.createWriteStream(`${OUTPUT_DIR}/${newFilename}`);
        const request = http.get(ttsUrl, function (response) {
            response.pipe(file);

            response.on('end', () => {
                pushProcessedAudioObj({ text, filename: newFilename });
                resolve({ success: true });
            });
        }).on('error', (err) => {
            reject({ err });
        });
    });
}

function stopAllSounds() {
    _audioObjs.forEach(tempAudioObj => {
        stopAudioForAudioObj(tempAudioObj);
    });
}

// Returns a promise
function playSoundFromReq(req) {
    const text = getTextFromReq(req);
    const audioObjIndex = findAudioObjIndexByText(text);

    if (audioObjIndex >= 0) {
        const playResult = playSoundByIndex(audioObjIndex);
        return Promise.resolve(playResult);//res.json({ success: playResult });

    } else {
        return processSoundByText(text)
            .then(data => {
                const success = playSoundByText(text);

                return success; //res.json({ success });
            })
            .catch(err => {
                console.log("Err", err);
                return false; //res.json({ success: false });
            });
    }

}

module.exports = {
    processSound: (req, res) => {
        const text = getTextFromReq(req);

        // If there was no text.
        if (!text || text.trim() === "") {
            return res.json({ success: false, errMsg: "no text" })
        }
        console.log('start');
        processSoundByText(text)
            .then(data => {
                return res.json({ success: data });
            })
            .catch(err => {
                return res.json({ success: false });
            });
    },
    playSound: (req, res) => {
        return playSoundFromReq(req)
            .then(playResult => {
                res.json({ success: playResult });
            })
            .catch(err => {
                res.json({ success: false, err });
            });
    },
    // stopSound: (req, res) => {
    //     return res.json({
    //         success: true
    //     })
    // },
    stopAllSounds: (req, res) => {
        stopAllSounds();

        return res.json({
            success: true
        })
    },

    stopAllSoundsAndPlaySound: (req, res) => {
        stopAllSounds();

        return playSoundFromReq(req)
            .then(playResult => {
                res.json({ success: playResult });
            })
            .catch(err => {
                res.json({ success: false, err });
            });
    },
    // killSound: (req, res) => {
    //     return res.json({
    //         success: true
    //     })
    // },
    // killAll: (req, res) => {
    //     return res.json({
    //         success: true
    //     })
    // },
    processAndPlay: (req, res) => {
        const text = getTextFromReq(req);
    }
}