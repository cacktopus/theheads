const player = require('play-sound')(opts = {});

const http = require('http');
const fs = require('fs');
const md5 = require('md5');
const wavFileInfo = require('wav-file-info');

// Custom APIs
const MaryTtsApi = require(`../lib/MaryTtsApi`);

// Config related:
const OUTPUT_DIR = `outputs`;
const SAMPLES_DIR = `samples`;

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

class AudioController {
    constructor() {
        this._audioObjs = {}
    }

    // ------------------------------
    // Request related
    getTextFromReq(req) {
        let text;
        if (req.body && req.body.text) {
            text = req.body.text;
        } else if (req.query && req.query.text) {
            text = req.query.text;
        }

        return text;
    }

    getOptionsFromReq(req) {
        // if (req.body && req.body.options) {
        //     options = req.body.options;
        // } else if (req.query && req.query.options) {
        //     options = req.query.options;
        // }

        return req.query;
    }

    // ------------------------------
    // Files and md5 related
    getMd5Filename(maryTTSURL) {
        if (maryTTSURL) {
            const filename = md5(maryTTSURL) + ".wav";
            return `${OUTPUT_DIR}/${filename}`
        } else {
            return undefined;
        }
    }

    // Returns a promise with the duration
    getWavDurationByFullPath(fullFileNamePath) {
        // const fullpath = `${OUTPUT_DIR}/${filename}`

        return new Promise((resolve, reject) => {
            wavFileInfo.infoByFilename(fullFileNamePath, function (err, info) {
                if (err) {
                    return reject(err);
                    // throw err;
                }

                if (info && info.duration) {
                    return resolve(info.duration);
                } else {
                    return resolve(undefined);
                }
            });
        })
    }

    // Check if a file already exists
    doesFileExist(filename) {
        const fs = require('fs');

        try {
            if (fs.existsSync(filename)) {
                return true
            }
        } catch (err) {
            console.error(err)
        }
        return false;
    }

    // ------------------------------
    // Audio related
    addAudioObj(audio, filename) {
        // First check if it's already there, if it is stop and delete it.
        this.stopAndDeleteRefAudioObjByFilename(filename);

        this._audioObjs[filename] = {
            audio,
            timestamp: new Date()
        }
    }

    stopAndDeleteRefAudioObjByFilename(filename) {
        if (this._audioObjs[filename]) {
            try {
                const audioObj = this._audioObjs[filename]; //.audioj;
                this.stopAudioForAudioObj(audioObj);
                delete this._audioObjs[filename];
            } catch (e) {
                console.log("Error in stopAndDeleteAudioObjByFilename: ", e);
            }
        }
    }

    // This returns a promise with the resolved value being the 'audio' object
    // This plays it by the filename (not including the outputs directory.
    // This returns the 'audio' object to be used to kill if necessary.
    //
    // The processAudioData will be something like:
    // { 
    //     success: true,
    //     processTime: 56,
    //     duration: 1061.125,
    //     totalDuration: 1117.125
    // }
    // This returns a promise with the resolved value being the 'audio' object
    // This plays it by the filename and should include the `output` directory
    // This returns the 'audio' object to be used to kill if necessary.
    playSoundByFilename({audioFilename, isSynchronous}) {

        return new Promise((resolve, reject) => {

            const fullFilename = audioFilename;

            // Play 15hz slightly before playing the actual audio
            // const sampleAudioFullPath = `${SAMPLES_DIR}/300hz-1sec.wav`;
            // const sampleAudioFullPath = `${SAMPLES_DIR}/40hz-1sec.wav`;
            // const sampleAudioFullPath = `${SAMPLES_DIR}/25hz-1sec.wav`;
            const sampleAudioFullPath = `${SAMPLES_DIR}/20hz-1sec.wav`;
            // const sampleAudioFullPath = `${SAMPLES_DIR}/15hz-1sec.wav`;
            // const sampleAudioFullPath = `${SAMPLES_DIR}/15hz-1sec.wav`;
            player.play(sampleAudioFullPath);

            const playDelayTime = 300;
            setTimeout(() => {
                let audio = player.play(fullFilename, function (err) {

                    if (err && !err.killed) {
                        console.log(err);
                        return reject(err);
                        // throw err
                    } else {
                        if (isSynchronous) {
                            return resolve(audio);
                        }
                        // if (callback && typeof callback === "function") {
                        //     callback();
                        // }
                    }
                });

                // Add the audio object to the class.
                this.addAudioObj(audio, audioFilename);
                if (!isSynchronous) {
                    return resolve(audio);
                }
            }, playDelayTime);
        });
    }

    stopAudioForAudioObj(audioObj) {
        if (audioObj && audioObj.audio && audioObj.audio.kill) {
            audioObj.audio.kill();
            return true;
        } else {
            // Nothing to kill
            return false;
        }
    }

    stopAndDeleteAllRefAudioObj() {
        for (let index in this._audioObjs) {
            try {
                let tempAudioObj = this._audioObjs[index]; //.audioObj;
                this.stopAudioForAudioObj(tempAudioObj);
                delete this._audioObjs[index];
            } catch (e) {
                console.log('e: ', e);
            }
        }
    }

    // stopAllSounds() {
    //     for (let index in this._audioObjs) {
    //         try {
    //             let tempAudioObj = this._audioObjs[index].audioObj;
    //             this.stopAudioForAudioObj(tempAudioObj);
    //         } catch (e) {
    //             console.log('e: ', e);
    //         }
    //     };
    //     // this._audioObjs.forEach(tempAudioObj => {
    //     //     this.stopAudioForAudioObj(tempAudioObj);
    //     // });
    // }

    // Process sound, returns a promise
    processSoundByText(text, options, callback) {
        const initialTimestamp = new Date();

        const self = this;
        return new Promise((resolve, reject) => {

            if (!text || text.trim() === "") {
                return reject("No Text");
            }

            // Encode the text to URL format and create the ttsUrl
            // const encodedText = encodeURI(text);
            const ttsUrl = MaryTtsApi.getMaryTTSUrl(text, options); //`http://localhost:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=${encodedText}&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=&VOICE_SELECTIONS=cmu-slt-hsmm%20en_US%20female%20hmm&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&VOICE=cmu-slt-hsmm&AUDIO=WAVE_FILE`; //' -H 'Accept-Encoding: identity;q=1, *;q=0' -H 'Accept-Language: en-US,en;q=0.9' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://localhost:59125/' -H 'Cookie: _vwo_uuid_v2=DF0E5749002F1F137183F1F57F736BB8B|c2687ce03409733a0ee25030c97c5f26; _ga=GA1.1.550767621.1548186935; __adroll_fpc=8630eb24b37309c255b50f8283059f89; menu-translateY=100; menu-scale=200; menu-translateX=300; CET-Client=s%3AIjkU0Ex_vxfWsHT4-cfxl16_WzxHPF_o.HwlO1MQKTC8cT7brNOXNYEAjsx7aak4w4xvh6WvQb3k; nim=right; __ar_v4=LOMMLKOQ7NES5CPYGS7IEX%3A20190228%3A22%7CNFSSXVP6CJA45FD4HL4PFU%3A20190228%3A22%7CYFMJVVFZZZGPTP4BWJVET6%3A20190228%3A22%7CMYKBYGUXU5EXTEDUE323FL%3A20190207%3A2; CET-Admin=s%3AJ2Ompl5xiHoqDb3RSfFTC_xvcakKiFVF.v6iJmxHTGsUq4e4uy1lz3IzBmI0CTVyvW5u1zvfK2zQ; _gid=GA1.1.267155174.1551688106' -H 'Connection: keep-alive' -H 'Range: bytes=0-' --compressed`;
            // const ttsUrl = this.getMaryTTSUrl(text, options); //`http://localhost:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=${encodedText}&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=&VOICE_SELECTIONS=cmu-slt-hsmm%20en_US%20female%20hmm&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&VOICE=cmu-slt-hsmm&AUDIO=WAVE_FILE`; //' -H 'Accept-Encoding: identity;q=1, *;q=0' -H 'Accept-Language: en-US,en;q=0.9' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://localhost:59125/' -H 'Cookie: _vwo_uuid_v2=DF0E5749002F1F137183F1F57F736BB8B|c2687ce03409733a0ee25030c97c5f26; _ga=GA1.1.550767621.1548186935; __adroll_fpc=8630eb24b37309c255b50f8283059f89; menu-translateY=100; menu-scale=200; menu-translateX=300; CET-Client=s%3AIjkU0Ex_vxfWsHT4-cfxl16_WzxHPF_o.HwlO1MQKTC8cT7brNOXNYEAjsx7aak4w4xvh6WvQb3k; nim=right; __ar_v4=LOMMLKOQ7NES5CPYGS7IEX%3A20190228%3A22%7CNFSSXVP6CJA45FD4HL4PFU%3A20190228%3A22%7CYFMJVVFZZZGPTP4BWJVET6%3A20190228%3A22%7CMYKBYGUXU5EXTEDUE323FL%3A20190207%3A2; CET-Admin=s%3AJ2Ompl5xiHoqDb3RSfFTC_xvcakKiFVF.v6iJmxHTGsUq4e4uy1lz3IzBmI0CTVyvW5u1zvfK2zQ; _gid=GA1.1.267155174.1551688106' -H 'Connection: keep-alive' -H 'Range: bytes=0-' --compressed`;

            const newFilename = this.getMd5Filename(ttsUrl);
            if (this.doesFileExist(newFilename)) {
                // Don't re-process if file already exists
                // TODO: this check is duplicated elsewhere, but probably shouldn't be
                return resolve({success: true});
            }

            if (newFilename) {
                // const newFilename = `${++_audioCount}.wav`;

                // Download and save the file.
                const file = fs.createWriteStream(newFilename);
                console.log(`MaryTTS: ${ttsUrl}`);
                const request = http.get(ttsUrl, function (response) {
                    response.pipe(file);

                    response.on('end', () => {
                        // No need to add processed to audio obj, because we always check by md5 file anyway
                        // this.pushProcessedAudioObj({ text, filename: newFilename });
                        // addAudioObj(audioObj, filename) {

                        // Also calculate the duration of the audio
                        self.getWavDurationByFullPath(newFilename)
                            .then(duration => {
                                const durationMs = parseFloat(duration) * 1000;
                                const finalTimestamp = new Date();
                                const timeDiff = finalTimestamp - initialTimestamp;
                                const totalDuration = timeDiff + durationMs;
                                // console.log({ success: true, processTime : timeDiff, duration: durationMs, totalDuration });

                                return resolve({
                                    success: true,
                                    processTime: timeDiff,
                                    duration: durationMs,
                                    totalDuration
                                });
                            })
                            .catch(err => {
                                return resolve({success: true});
                            });


                    });
                }).on('error', (err) => {
                    return reject({err});
                });
            } else {
                return resolve({success: false, errMsg: "no filename, probably due to no text"});
            }
        });
    }

    // Returns a promise
    playSoundFromReq(req) {
        const self = this;
        const text = this.getTextFromReq(req);
        const options = this.getOptionsFromReq(req);
        const isSynchronous = options.isSync;
        let preProcessTime = 0;

        // const audioObjIndex = findAudioObjIndexByText(text);

        const ttsUrl = MaryTtsApi.getMaryTTSUrl(text, options);
        const filePath = this.getMd5Filename(ttsUrl);
        const isFileExists = this.doesFileExist(filePath);

        let promisePlaySound;

        console.log('isFileExists', isFileExists);
        // Check if file already exists, and if so just play it.
        if (isFileExists) {
            promisePlaySound = this.playSoundByFilename({audioFilename: filePath, isSynchronous})
            // .then(data => {
            //     return Object.assign({preProcessTime: 0}, data)
            // });
            // return playSoundByIndex(audioObjIndex);

            // const playResult = playSoundByIndex(audioObjIndex);
            // return Promise.resolve(playResult);//res.json({ success: playResult });

        } else {
            // let processAudioResults = {};
            promisePlaySound = this.processSoundByText(text, options)
                .then(data => {

                    // processAudioResults = data;
                    preProcessTime = data.processTime;
                    console.log('preProcessTime2', preProcessTime);
                    // console.log('pt2: ', processTime)
                    // preProcessTime = data.processTime;
                    // console.log("pro\n\n",preProcessTime);
                    return this.playSoundByFilename({audioFilename: filePath, isSynchronous});
                })
            // .then(playSoundResults => {
            //     let totalResults = Object.assign({processTime: processAudioResults.processTime}, playSoundResults);

            //     // // console.log('\n\n\ntotalResults', totalResults);
            //     // console.log('processAudioResults', processAudioResults);
            //     // console.log('\n\nplaySoundResults', playSoundResults);
            //     return totalResults
            // })
            // .catch(err => {
            //     console.log("Err", err);
            //     retprocessTimeurn false;
            // });
        }

        return new Promise((resolve, reject) => {
            promisePlaySound.then(results => {
                self.getWavDurationByFullPath(filePath)
                    .then(duration => {

                        if (duration > 0) {
                            const durationMs = parseFloat(duration) * 1000;
                            // const processTime = results.processTime;
                            const totalDuration = durationMs + preProcessTime;
                            // const finalTimestamp = new Date();
                            // const timestampDiff = finalTimestamp - initialTimestamp;
                            // const totalDuration = timestampDiff + durationMs;

                            // console.log('\n\n', {durationMs, preProcessTime, totalDuration, results});

                            resolve({
                                "success": true,
                                "processTime": preProcessTime,
                                "duration": durationMs,
                                "totalDuration": totalDuration
                            })
                        } else {
                            resolve({
                                "success": true,
                                "noduration": true
                            });
                        }
                    });
            })
        });
    }
}

// Init the global instance of AudioObj
let _AudioController = new AudioController();

module.exports = {
    processSound: (req, res) => {
        const text = _AudioController.getTextFromReq(req);

        // If there was no text.
        if (!text || text.trim() === "") {
            return res.json({success: false, errMsg: "no text"})
        }

        _AudioController.processSoundByText(text)
            .then(data => {
                return res.json({success: data});
            })
            .catch(err => {
                return res.json({success: false});
            });
    },
    playSound: (req, res) => {

        return _AudioController.playSoundFromReq(req)
            .then(playResult => {
                let results = Object.assign({}, playResult, {success: true});
                res.json(results);
            })
            .catch(err => {
                console.log('err', err);
                res.json({success: false, err});
            });
    },
    // stopSound: (req, res) => {
    //     return res.json({
    //         success: true
    //     })
    // },
    stopAllSounds: (req, res) => {
        _AudioController.stopAndDeleteAllRefAudioObj();

        return res.json({
            success: true
        })
    },

    stopAllSoundsAndPlaySound: (req, res) => {
        _AudioController.stopAndDeleteAllRefAudioObj();

        return _AudioController.playSoundFromReq(req)
            .then(playResult => {
                res.json(playResult);
            })
            .catch(err => {
                res.json({success: false, err});
            });
    },

    // Testing
    getVoices: (req, res) => {
        MaryTtsApi.getVoices()
            .then(data => {
                if (data) {
                    res.json(data);
                } else {
                    console.log('No voices, maybe because no connection to mary tts');
                    res.json([])
                }
            })
            .catch(err => {
                res.json({err: JSON.stringify(err)});
            });
    },
    // Testing
    getAudioEffects: (req, res) => {
        MaryTtsApi.getAudioEffects()
            .then(data => {
                if (data) {
                    res.json(data);
                } else {
                    console.log('No audio effects, maybe because no connection to mary tts');
                    res.json({})
                }
            })
            .catch(err => {
                res.json({err: JSON.stringify(err)});
            });
    },

    testTime: (req, res) => {
        const initialTime = new Date();

        setTimeout(() => {
            const timeDiff = new Date() - initialTime;
            res.json({
                timeDiff
            })
        }, 60 * 1000);
    }


    // getMaryTTSUrl(text, options) {
    //     console.log('getMaryTTSUrl: use those options');
    //     // Encode the text to URL format and create the ttsUrl
    //     const encodedText = encodeURI(text);
    //     const ttsUrl = `http://localhost:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=${encodedText}&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=&VOICE_SELECTIONS=cmu-slt-hsmm%20en_US%20female%20hmm&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&VOICE=cmu-slt-hsmm&AUDIO=WAVE_FILE`; 
    //     //' -H 'Accept-Encoding: identity;q=1, *;q=0' -H 'Accept-Language: en-US,en;q=0.9' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://localhost:59125/' -H 'Cookie: _vwo_uuid_v2=DF0E5749002F1F137183F1F57F736BB8B|c2687ce03409733a0ee25030c97c5f26; _ga=GA1.1.550767621.1548186935; __adroll_fpc=8630eb24b37309c255b50f8283059f89; menu-translateY=100; menu-scale=200; menu-translateX=300; CET-Client=s%3AIjkU0Ex_vxfWsHT4-cfxl16_WzxHPF_o.HwlO1MQKTC8cT7brNOXNYEAjsx7aak4w4xvh6WvQb3k; nim=right; __ar_v4=LOMMLKOQ7NES5CPYGS7IEX%3A20190228%3A22%7CNFSSXVP6CJA45FD4HL4PFU%3A20190228%3A22%7CYFMJVVFZZZGPTP4BWJVET6%3A20190228%3A22%7CMYKBYGUXU5EXTEDUE323FL%3A20190207%3A2; CET-Admin=s%3AJ2Ompl5xiHoqDb3RSfFTC_xvcakKiFVF.v6iJmxHTGsUq4e4uy1lz3IzBmI0CTVyvW5u1zvfK2zQ; _gid=GA1.1.267155174.1551688106' -H 'Connection: keep-alive' -H 'Range: bytes=0-' --compressed`;

    //     return ttsUrl;
    // }
};