const axios = require('axios');
const queryString = require("query-string");

// CONSTANTS
const ENDPOINT_MARYTTS = `http://127.0.0.1:59125`;


// Some global vars

// A list of voices and their related locales. E.g. 
// { 
//     'dfki-spike-hsmm' : { 
//         locale: 'en_GB' 
//     } 
// }
// let this._list_voices_and_locales = [];
// let this._list_audio_effects = [];
// let this._default_voice = "cmu-slt-hsmm";

function processAxiosError(url, error) {
    console.log(`MaryTtsApi->processError: Error processing: ${url}`);

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('The request was made and the server responded with a status code that falls out of the range of 2xx. ');

        //   console.log(error.response.data);
        console.log(error.response.status);
        //   console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        //   console.log(error.request);
        console.log('Error: The request was made but no response was received');
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    // console.log(error.config);
    return undefined;
}

class MaryTtsApiClass {
    constructor() {
        this._list_voices_and_locales = [];
        this._list_audio_effects = [];
        this._default_voice = "cmu-slt-hsmm";
    }

    // Gets voices and returns a promise with the data
    getVoices() {
        const url = `${ENDPOINT_MARYTTS}/voices`;

        return axios.get(url)
            .then(function (response) {
                if (response && response.data && response.data.length > 0) {
                    return response.data.split('\n').filter(voice => voice.trim().length > 0).map(voice => {
                        const [voiceName, locale] = voice.split(' ');
                        return { name: voiceName, locale };
                    })

                } else {
                    console.log('No voices');
                    res.json([]);
                }
            })
            .catch(function (error) {
                return processAxiosError(url, error);
            });
    }

    getLocaleForVoice(voiceName) {
        const indexOfVoice = this._list_voices_and_locales.findIndex(voice => {
            return voice.name === voiceName;
        });


        if (indexOfVoice >= 0) {
            return this._list_voices_and_locales[indexOfVoice].locale;
        } else {
            return undefined;
        }
    }

    // Gets list of effects and returns a promise with the data.
    //
    // [
    //     {
    //         "name": "Volume",
    //         "params": {
    //             "amount": "2.0"
    //         }
    //     },
    //     ...
    // ]
    getAudioEffects() {
        const url = `${ENDPOINT_MARYTTS}/audioeffects`;

        return axios.get(url)
            .then(function (response) {
                if (response && response.data && response.data.length > 0) {
                    return response.data.split('\n').filter(effect => effect.trim().length > 0)
                        .map(effect => {
                            try {
                                let effectParams = {};
                                let [effectName, effectParamsArray] = effect.split(" ");
                                effectParamsArray = effectParamsArray.split(";");

                                effectParamsArray.forEach(effectParam => {
                                    let [effectParamName, effectParamAmount] = effectParam.split(":");
                                    if (effectParamName && effectParamName !== '')
                                        effectParams[effectParamName] = effectParamAmount;
                                })

                                return { name: effectName, params: effectParams };
                            } catch (e) {
                                console.log("Error in MaryTtsApi.getAudioEffects: ", e);
                                return { name: "", params: "" };
                            }
                        })

                } else {
                    console.log('No effects');
                    res.json([]);
                }
            })
            .catch(function (error) {
                return processAxiosError(url, error);
            });
    }

    // Gets voices and returns a promise with the data
    getLocales() {
        const url = `${ENDPOINT_MARYTTS}/voices`;

        return axios.get(url)
            .then(function (response) {
                if (response && response.data && response.data.length > 0) {
                    return response.data.split('\n').filter(voice => voice.trim().length > 0);

                } else {
                    return undefined;
                }
            })
            .catch(function (error) {
                return processAxiosError(url, error);
            });
    }

    getVoiceNameIndex(voiceName) {
        let indexOfVoice = this._list_voices_and_locales.findIndex(voice => {
            return voice.name === voiceName;
        });

        if (indexOfVoice >= 0) {
            return indexOfVoice;
        } else {
            return -1;
        }
        // indexOfVoice = this._list_voices_and_locales.findIndex(voice => {
        //         return voice.name === this._default_voice;
        //     });

        //     if (indexOfVoice >= 0 ) {
        //         return indexOfVoice;
        //     } else {
        //         return -1;
        //     }
        // }
    }

    getVoiceNameIndexOrDefaultIndex(voiceName) {
        let voiceIndex = this.getVoiceNameIndex(voiceName);

        if (voiceIndex >= 0) {
            return voiceIndex;
        } else {
            // If voice name doesn't exist
            voiceIndex = this.getVoiceNameIndex(this._default_voice);

            return voiceIndex;
        }
    }

    // Tries to use the requested voice and locale,
    // but double check that the coice and locale exists, 
    // if not just use a default voice.
    // [
    //     {
    //     "name": "dfki-spike-hsmm",
    //     "locale": "en_GB"
    //     },
    //     ...
    // ]
    getVoiceAndLocale(voiceName) {
        // Check if voiceName exists
        const indexOfVoice = this.getVoiceNameIndexOrDefaultIndex(voiceName);

        if (indexOfVoice >= 0) {
            let tempVoice = this._list_voices_and_locales[indexOfVoice];
            return { voice: tempVoice.name, locale: tempVoice.locale }
        } else {
            return { voice: undefined, locale: undefined }
        }
    }

    // Takes the query options and passes along any valid effects
    // NOTE! This does not work with effecst that use multiple params  (e.g. not Chorus or FIRFilter)
    getEffectsOptions(options = {}) {
        // NOTE: This assumes just one param for the effect
        // This also assumes validation has already been made for the effect 
        const getNewOptionsForEffect = (effectName, value) => {
            let options = {};
            const effectIndex = this._list_audio_effects.findIndex(fx => fx.name === effectName);

            if (effectIndex >= 0) {
                try {
                    const paramName = Object.keys(this._list_audio_effects[effectIndex].params)[0];
                    options[`effect_${effectName}_selected`] = 'on',
                        options[`effect_${effectName}_parameters`] = `${paramName}:${value}`;

                    return options;
                } catch (err) {
                    console.log('bad getNewOptionsForEffect', err);
                    return {};
                }
            } else {
                return {};
            }
        }

        let returnedOptions = {};

        // Force the volume to be 0.7, otherwise sometimes it distorts.
        const maxVolume = 0.7;
        const minVolume = 0.1;
        let forcedVolume = {
            effect_Volume_selected: 'on',
            effect_Volume_parameters: `amount:${maxVolume}`
        }
        Object.assign(returnedOptions, forcedVolume);

        // Check which is bigger list of audio effects or list of options...
        try {
            this._list_audio_effects
                .filter(effect => {
                    // FOR NOW LETS JUST USE EFFECTS THAT USE 1 PARAM (e.g. not Chorus or FIRFilter)
                    const params = Object.keys(effect.params);
                    return params && params.length === 1;
                })
                .filter(effect => {
                    // Check if the effect is in the list of options.
                    return options[effect.name] !== undefined;
                })
                .filter(effect => {
                    // Ensure the value of the option is a number
                    return !isNaN(options[effect.name])
                })
                .forEach(effect => {
                    
                    const effectValParsedFloat = parseFloat(options[effect.name])
                    // If the effect is Volume, ensure its value is less than maxVolume and above 0
                    if (effect.name !== "Volume" || (effectValParsedFloat < maxVolume && effectValParsedFloat > minVolume)) {
                        const newOptions = getNewOptionsForEffect(effect.name, options[effect.name]);
                        Object.assign(returnedOptions, newOptions);
                    }
                });

            return returnedOptions;
        } catch (err) {
            console.log(err);
            return {};
        }
    }

    // getLocalFromOptions(options) {
    //     console.log('get local... and return it');
    // }

    // getMaryTTSUrl(text, options) {
    //     console.log('getMaryTTSUrl: use those options');
    //     // Encode the text to URL format and create the ttsUrl
    //     const encodedText = encodeURI(text);
    //     const ttsUrl = `http://localhost:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=${encodedText}&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=&VOICE_SELECTIONS=cmu-slt-hsmm%20en_US%20female%20hmm&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&VOICE=cmu-slt-hsmm&AUDIO=WAVE_FILE`; 
    //     //' -H 'Accept-Encoding: identity;q=1, *;q=0' -H 'Accept-Language: en-US,en;q=0.9' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://localhost:59125/' -H 'Cookie: _vwo_uuid_v2=DF0E5749002F1F137183F1F57F736BB8B|c2687ce03409733a0ee25030c97c5f26; _ga=GA1.1.550767621.1548186935; __adroll_fpc=8630eb24b37309c255b50f8283059f89; menu-translateY=100; menu-scale=200; menu-translateX=300; CET-Client=s%3AIjkU0Ex_vxfWsHT4-cfxl16_WzxHPF_o.HwlO1MQKTC8cT7brNOXNYEAjsx7aak4w4xvh6WvQb3k; nim=right; __ar_v4=LOMMLKOQ7NES5CPYGS7IEX%3A20190228%3A22%7CNFSSXVP6CJA45FD4HL4PFU%3A20190228%3A22%7CYFMJVVFZZZGPTP4BWJVET6%3A20190228%3A22%7CMYKBYGUXU5EXTEDUE323FL%3A20190207%3A2; CET-Admin=s%3AJ2Ompl5xiHoqDb3RSfFTC_xvcakKiFVF.v6iJmxHTGsUq4e4uy1lz3IzBmI0CTVyvW5u1zvfK2zQ; _gid=GA1.1.267155174.1551688106' -H 'Connection: keep-alive' -H 'Range: bytes=0-' --compressed`;

    //     return ttsUrl;
    // }

    getMaryTTSUrl(text, options = {}) {
        // This gets the voce and locale, and uses default if given voice is invalid
        const { voice, locale } = this.getVoiceAndLocale(options.voice);

        // console.log('options', options, voice, locale);

        // const { text 
        // Encode the text to URL format and create the ttsUrl
        // const encodedText = encodeURI(text);

        let submitOptions = {
            INPUT_TYPE: 'TEXT',
            OUTPUT_TYPE: `AUDIO`,
            INPUT_TEXT: text,
            AUDIO_OUT: `WAVE_FILE`,
            LOCALE: locale,
            VOICE: voice,
            AUDIO: `WAVE_FILE`
        };

        // Add effects if needed
        const effectsOptions = this.getEffectsOptions(options);
        
        Object.assign(submitOptions, effectsOptions);
        // console.log('final: effectsOptions', effectsOptions);

        let queryOptions = queryString.stringify(submitOptions);
        const ttsUrl = `http://localhost:59125/process?${queryOptions}`;
        // const ttsUrl = `http://localhost:59125/process?${queryString} INPUT_TYPE=TEXT&OUTPUT_TYPE=${OUTPUT_TYPE}&INPUT_TEXT=${encodedText}&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=&VOICE_SELECTIONS=cmu-slt-hsmm%20en_US%20female%20hmm&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&VOICE=cmu-slt-hsmm&AUDIO=WAVE_FILE`; 
        //' -H 'Accept-Encoding: identity;q=1, *;q=0' -H 'Accept-Language: en-US,en;q=0.9' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://localhost:59125/' -H 'Cookie: _vwo_uuid_v2=DF0E5749002F1F137183F1F57F736BB8B|c2687ce03409733a0ee25030c97c5f26; _ga=GA1.1.550767621.1548186935; __adroll_fpc=8630eb24b37309c255b50f8283059f89; menu-translateY=100; menu-scale=200; menu-translateX=300; CET-Client=s%3AIjkU0Ex_vxfWsHT4-cfxl16_WzxHPF_o.HwlO1MQKTC8cT7brNOXNYEAjsx7aak4w4xvh6WvQb3k; nim=right; __ar_v4=LOMMLKOQ7NES5CPYGS7IEX%3A20190228%3A22%7CNFSSXVP6CJA45FD4HL4PFU%3A20190228%3A22%7CYFMJVVFZZZGPTP4BWJVET6%3A20190228%3A22%7CMYKBYGUXU5EXTEDUE323FL%3A20190207%3A2; CET-Admin=s%3AJ2Ompl5xiHoqDb3RSfFTC_xvcakKiFVF.v6iJmxHTGsUq4e4uy1lz3IzBmI0CTVyvW5u1zvfK2zQ; _gid=GA1.1.267155174.1551688106' -H 'Connection: keep-alive' -H 'Range: bytes=0-' --compressed`;

        return ttsUrl;
    }

    /*
    http://localhost:59125/process
        ?INPUT_TYPE=TEXT
        &OUTPUT_TYPE=AUDIO
        &INPUT_TEXT=hi%20there%20mr%20large%20brain%20healthy%20man
        &effect_FIRFilter_selected=on
        &effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0
        &effect_FIRFilter_default=Default
        &effect_FIRFilter_help=Help
        &AUDIO_OUT=WAVE_FILE
        &LOCALE=en_GB
        &VOICE=dfki-spike-hsmm
        &AUDIO=WAVE_FILE
    */

    setDefaultVoice(voicesArray) {
        // Check if default voice is there, if not use first in list of voiceArray
        const arrayDefaultVoice = voicesArray.filter(voice => {
            return voice.name === this._default_voice
        });

        // if the default voice isn't there.
        if (arrayDefaultVoice.length === 0) {
            if (voicesArray.length > 0) {
                this._default_voice = voicesArray[0].name
            }
        }
    }

    setVoicesAndLocales(voicesArray) {
        // Set the list of voices
        this._list_voices_and_locales = voicesArray;
    }

    setAudioEffects(effects) {
        // Set the list of voices
        this._list_audio_effects = effects;
    }

    initializeApiData() {
        // Initialize the list of audio effects & voices
        const self = this;

        this.getVoices()
            .then(voicesArray => {
                if (voicesArray && voicesArray.length > 0) {
                    // Set the list of voices
                    self.setVoicesAndLocales(voicesArray);
                    self.setDefaultVoice(voicesArray);
                } else {
                    console.log("NO CONNECTION TO MARY TTS. Cannot init voices.");
                }

            })

        // Initialize the list of audio effects & voices
        this.getAudioEffects()
            .then(audioEffectsArray => {
                self.setAudioEffects(audioEffectsArray);
                // MaryTtsApi._list_audio_effects = audioEffectsArray;
            })
    }

}

const MaryTtsApi = new MaryTtsApiClass();

// initializeApiData() {
//     // function setDefaultVoice(voicesArray) {
//     //     // Check if default voice is there, if not use first in list of voiceArray
//     //     const arrayDefaultVoice = voicesArray.filter(voice => {
//     //         return voice.name === this._default_voice
//     //     });

//     //     // if the default voice isn't there.
//     //     if (arrayDefaultVoice.length === 0) {
//     //         if (voicesArray.length > 0) {
//     //             this._default_voice = voicesArray[0].name
//     //         }
//     //     }

//     //     console.log('local of defaul: ' + MaryTtsApi.getLocaleForVoice(this._default_voice));
//     // }

//     // function setVoicesAndLocales(voicesArray) {
//     //     // Set the list of voices
//     //     this._list_voices_and_locales = voicesArray;
//     // }

//     // Initialize the list of audio effects & voices
//     MaryTtsApi.getVoices()
//         .then(voicesArray => {
//             if (voicesArray && voicesArray.length > 0) {
//                 // Set the list of voices
//                 MaryTtsApi.setVoicesAndLocales(voicesArray);
//                 MaryTtsApi.setDefaultVoice(voicesArray);
//             } else {
//                 console.log("NO CONNECTION TO MARY TTS. Cannot init voices.");
//             }

//         })

//     // Initialize the list of audio effects & voices
//     MaryTtsApi.getAudioEffects()
//         .then(audioEffectsArray => {
//             MaryTtsApi.setAudioEffects(audioEffectsArray);
//             // MaryTtsApi._list_audio_effects = audioEffectsArray;
//         })
// }

MaryTtsApi.initializeApiData();
setInterval(() => MaryTtsApi.initializeApiData(), 60 * 1000); // Every minute refresh data, just in case

module.exports = MaryTtsApi;
