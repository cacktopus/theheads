// https://redux.js.org/basics/exampletodolist#entry-point
// http://localhost:3000/

import React from 'react'
// import { fromJS } from 'immutable';

let exportSceneMsgTimeout;

const defaultWebsocketUrl = 'ws://' + window.location.hostname + ":" + window.location.port + '/ws';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sceneUrl : "/installation/dev/scene.json",
            // sceneUrl : "/build/json/temp.json",
            websocketUrl : defaultWebsocketUrl, //"ws://localhost:8081/ws"
            // sceneUrl : "/json/temp.json"
            // sceneUrl : "/json/temp2.json"
        };

        this.addStand = this.addStand.bind(this);
        this.setLoadSceneUrl = this.setLoadSceneUrl.bind(this);
        this.loadScene = this.loadScene.bind(this);
        this.loadLocalSceneJson = this.loadLocalSceneJson.bind(this);

        this.addNewCamera = this.addNewCamera.bind(this);
        this.removeCurrentCamera = this.removeCurrentCamera.bind(this);
        this.exportSceneToJSON = this.exportSceneToJSON.bind(this);
        this.setScale = e => { props.setScale(e.target.value) };
        this.setTranslateX = e => { props.setTranslateX(e.target.value) };
        this.setTranslateY = e => { props.setTranslateY(e.target.value) };

        this.setWebsocketUrl = e => { this.setState({websocketUrl : e.target.value}) };
        this.websocketConnect = this.websocketConnect.bind(this);
        this.websocketLoadLocalhostUrl = this.websocketLoadLocalhostUrl.bind(this);
        this.websocketLoadOtherUrl = this.websocketLoadOtherUrl.bind(this);
    }

    addStand() {
        this.props.addStand({})
    }

    setLoadSceneUrl(e) {
        const sceneUrl = e.target.value;
        this.setState({sceneUrl});
    }

    exportSceneToJSON() {
        var stands = this.props.stands.toJS();

        var scene = JSON.stringify({ name: "export", stands });

        // document.create
        var el = document.getElementById("clipboard-input");
        el.value = scene;
        el.select();
        document.execCommand("copy");

        const msg = document.getElementById("clipboard-msg");
        msg.innerText = "Copied";
        clearTimeout(exportSceneMsgTimeout);

        exportSceneMsgTimeout = setTimeout(() => {
            msg.innerText = "";
        }, 1000);
    }

    loadScene() {
        this.props.loadSceneFromUrl(this.state.sceneUrl);
    }

    loadLocalSceneJson() {
        this.setState({
            sceneUrl: "json/temp.json"
        })
    }

    addNewCamera() {
        this.props.cameraAddNew(this.props.selectedStandIndex);
    }

    removeCurrentCamera() {
        this.props.cameraRemove(this.props.selectedStandIndex, this.props.selectedCameraIndex);
    }

    websocketConnect() {
        this.props.websocketConnect(this.state.websocketUrl);
    }
    
    websocketLoadLocalhostUrl() {
        this.setState({
            websocketUrl: "ws://localhost:8081/ws"
        })
    }
    
    websocketLoadOtherUrl() {

    }

    render() {

        // {
        //     "name": "stand0",
        //     "pos": {
        //         "x": 54,
        //         "y": 13
        //     },
        //     "rot": 0,
        //     "cameras": [
        //         {
        //             "name": "camera0",
        //             "pos": {
        //                 "x": 0.1,
        //                 "y": 0
        //             },
        //             "rot": 0,
        //             "fov": 60,
        //             "description": "Raspberry Pi PiNoir Camera V2 Video Module"
        //         }
        //     ],
        //     "heads": [
        //         {
        //             "name": "head0",
        //             "pos": {
        //                 "x": 0,
        //                 "y": 0
        //             },
        //             "rot": 0
        //         }
        //     ]
        // }"

        const standSchema = {
            "name": { type: "text" },
            "pos": {
                type: "pos"
                // type: "obj",
                // obj : { 
                //     x: {type: 'number'},
                //     y: {type: 'number'}
                // }
            },
            "rot": { type: "number", min: -1 * Math.PI, max: Math.PI },
        };

        const cameraSchema = {
            "name": { type: "text" },
            "pos": {
                type: "pos"
                // type: "obj",
                // obj : { 
                //     x: {type: 'number'},
                //     y: {type: 'number'}
                // }
            },
            "rot": { type: "number", min: -1 * Math.PI, max: Math.PI },
            "fov": { type: "number" },
            "description": { type: "text" }

            // "name" : {type: "text"},
            // "pos": {
            //     type: "pos"
            //     // type: "obj",
            //     // obj: {
            //     //     "x": { type: "number" },
            //     //     "y": { type: "number" }
            //     // }
            // },
            // "rot": { type: "number", min: -1 * Math.PI, max: Math.PI },
            // "fov": { type: "number" },
            // "description": { type: "text" }
        };

        const headSchema = {
            "name": { type: "text" },
            "pos": {
                type: "pos"
                // type: "obj",
                // obj: {
                //     "x": { type: "number" },
                //     "y": { type: "number" }
                // }
            },
            "rot": { type: "number", min: -1 * Math.PI, max: Math.PI },
        };

        // `fieldNames` param is of type array. e.g. fieldNames = [0, "heads", 0, "rot"]
        const inputHandler = fieldNames => {
            
            return (e) => {
                const value = e.target.value;

                this.props.standSetInFields(this.props.selectedStandIndex, fieldNames, value);
                // this.props.standSetField(this.props.selectedStandIndex, fieldName, value);
            }
        }

        // // `fieldNames` param is of type array. e.g. fieldNames = [0, "heads", 0, "rot"]
        // const inputHandlerForFieldNames = fieldNames => {
        //     return (e) => {
        //         const value = e.target.value;
        //         this.props.standSetInFields(this.props.selectedStandIndex, fieldNames, value);
        //     }
        // }

        const posHandler = (fieldNames, axis) => {
            return (e) => {
                let value = parseFloat(e.target.value);
                if (isNaN(value)) {
                    value = "";
                }

                // console.log("====", this.props.selectedStandIndex, fieldName, axis, value);
                this.props.standSetInFields(this.props.selectedStandIndex, [...fieldNames, axis], value);
            }
        }

        // const getTextInput = ({label, name, value, onChange}) => {
        const getTextInput = ({ fieldName, fieldVal, parentFieldNames }) => {
            return getInput({ fieldName, fieldVal, type: "text", parentFieldNames });
        }

        const getNumberInput = ({ fieldName, fieldVal, parentFieldNames }) => {
            return getInput({ fieldName, fieldVal, type: "number", parentFieldNames });
        }

        const getPosInput = ({ fieldName, fieldVal, parentFieldNames }) => {
            const { x, y } = fieldVal && fieldVal.toJS ? fieldVal.toJS() : {x: 0, y: 0};
            const fieldNameX = `${fieldName}.x`;
            const fieldNameY = `${fieldName}.y`;

            window.c_sdfa2 = { fieldName, fieldVal };

            const fieldNames = [...parentFieldNames, fieldName];

            return (
                <div className="Menu-form-posType">
                    <label htmlFor={fieldNameX}>X</label>
                    <input className="Menu-form-posType-X" name={fieldNameX} type="number" onChange={posHandler(fieldNames, "x")} value={x} />
                    <label htmlFor={fieldNameY} style={{minWidth: 0}}>Y</label>
                    <input className="Menu-form-posType-Y" name={fieldNameY} type="number" onChange={posHandler(fieldNames, "y")} value={y} />
                </div>
            );
        }

        const getInput = ({ fieldName, fieldVal, type, parentFieldNames }) => {
            const fieldNames = [...parentFieldNames, fieldName];
            return (
                <div>
                    <label htmlFor={fieldName}>{fieldName}</label>
                    <input name={fieldName} type={type} onChange={inputHandler(fieldNames)} value={fieldVal} />
                </div>
            )
        }

        // Got through each for schema... then get associated to object
        // The parent field names is in case the onChange needs to pass along more field names for the stand
        const getInputsBySchema = ({ schema, immutableObj, parentFieldNames = [] }) => {
            if (!immutableObj || !immutableObj.get) {
                return null;
            }

            var fields = Object.keys(schema);

            return fields.map(fieldName => {
                const fieldVal = immutableObj.get(fieldName);
                // const type = fields[fieldName] ? fields[fieldName].type : "";

                // console.log("fieldVal", fieldVal)

                switch (schema[fieldName].type) {
                    case "text":
                        return <span key={fieldName}>{getTextInput({ fieldName, fieldVal, parentFieldNames })}</span>
                    case "number":
                        return <span key={fieldName}>{getNumberInput({ fieldName, fieldVal, parentFieldNames })}</span>
                    // case "array":
                    //     break;
                    case "pos":
                        return <span key={fieldName}>{getPosInput({ fieldName, fieldVal, parentFieldNames })}</span>
                    case "obj":
                        return <div key={fieldName}>OBJ - {fieldName}</div>
                    default:
                        return null;
                }
            })
        }

        // const standSchema = {
        //     "name": { type: "text" },
        //     "pos": { type: "obj", obj : { x: {type: 'number', y: {type: 'number'}}} },
        //     "rot": { type: "number"},
        //     "cameras": {
        //         type: "array", 
        //         arrayObj : {
        //             "name" : {type: "text"},
        //             "pos": {
        //                 type: "obj",
        //                 obj: {
        //                     "x": { type: "number" },
        //                     "y": { type: "number" }
        //                 }
        //             },
        //             "rot": { type: "number" },
        //             "fov": { type: "number" },
        //             "description": { type: "text" }
        //         }
        //     },
        //     "heads": {
        //         type: "array",
        //         arrayObj : {
        //             "name" : {type: "text"},
        //             "pos": {
        //                 type: "obj",
        //                 obj: {
        //                     "x": { type: "number" },
        //                     "y": { type: "number" }
        //                 }
        //             },
        //             "rot": { type: "number" },
        //         }
        //     }
        // };

        const stands = this.props.stands;
        const menu = this.props.menu;
        const selectedStandIndex = this.props.selectedStandIndex;
        const selectedHeadIndex = menu.get("selectedHeadIndex");
        const selectedCameraIndex = menu.get("selectedCameraIndex");
        const scale = menu.get("scale");
        const translateX = menu.getIn(["translate", "x"]);
        const translateY = menu.getIn(["translate", "y"]);

        const getStandInfo = () => {
            if (stands.size > 0 && stands.get) {
                const stand = stands.get(selectedStandIndex);
                if (stand) {
                    return {
                        selectedStand: stand,
                        cameras: stand && stand.get ? stand.get("cameras") : [],
                        heads: stand && stand.get ? stand.get("heads") : []
                    }
                }
            }

            return {
                selectedStand: {},
                cameras: [],
                heads: []
            };
        }

        const { selectedStand, cameras, heads } = getStandInfo();

        const standOptions = stands.map((stand, i) => {
            return <option key={i} value={i}>{i} - {stand.get("name")}</option>
        });

        const cameraOptions = cameras.map((camera, i) => {
            return <option key={i} value={i}>{i} - {camera.get("name")}</option>
        });

        const headOptions = heads.map((head, i) => {
            return <option key={i} value={i}>{i} - {head.get("name")}</option>
        });

        const getStandForm = () => {
            return getInputsBySchema({ schema: standSchema, immutableObj: selectedStand });
        }

        const getHeadForm = () => {
            const selectedHead = heads && heads.get ? heads.get(selectedHeadIndex) : undefined;
            if (selectedHead !== undefined) {
                return getInputsBySchema({ schema: headSchema, immutableObj: selectedHead, parentFieldNames: ["heads", selectedHeadIndex] });
            } else {
                return undefined;
            }
        }
        
        const getCameraForm = () => {
            const selectedCamera = cameras && cameras.get ? cameras.get(selectedCameraIndex) : undefined;
            if (selectedCamera !== undefined) {
                return getInputsBySchema({ schema: cameraSchema, immutableObj: selectedCamera, parentFieldNames: ["cameras", selectedCameraIndex] });
            } else {
                return undefined;
            }
        }

        const standInputs = getStandForm();

        const headInputs = getHeadForm();

        const cameraInputs = getCameraForm();

        const areRotatesHidden = this.props.menu.get("areRotatesHidden");

        const transformLabelStyles = {width: 120};

        return (
            <div className="Menu">
                <div>
                    <div className="Menu-section">
                        <div className="Menu-addStandButton" onClick={this.addStand}>Add Stand</div>
                    </div>
                    <div className="Menu-section Menu-section--stand">
                        <div>
                            <label className="Menu-form-label">Stand</label><br />
                            <select value={selectedStandIndex} onChange={(e) => this.props.selectStand(e.target.value)}>
                                {standOptions}
                            </select>
                        </div>
                    </div>
                    <div className="Menu-section Menu-section--standInputs" >
                        {standInputs}
                    </div>
                    <div className="Menu-section Menu-section--camera" style={{ paddingLeft: "20px", float: "left" }}>
                        <div>
                            <label className="Menu-form-label">Camera</label><br />
                            <select value={selectedCameraIndex} onChange={(e) => this.props.selectCamera(e.target.value)}>
                                {cameraOptions}
                            </select>
                        </div>
                        <div>
                            <button onClick={this.addNewCamera}>Add New</button><br/><br/>
                        </div>
                        <div>
                            <button onClick={this.removeCurrentCamera}>Remove Current</button>
                        </div>
                    </div>
                    <div className="Menu-section Menu-section--cameraInputs" >
                        {cameraInputs}
                    </div>

                    <div className="Menu-section Menu-section--head" style={{ paddingLeft: "20px", float: "left" }}>
                        <div>
                            <label className="Menu-form-label">Head</label><br />
                            <select value={this.props.menu.get("selectedHeadIndex")} onChange={(e) => this.props.selectHead(e.target.value)}>
                                {headOptions}
                            </select>
                        </div>
                    </div>
                    <div className="Menu-section Menu-section--headInputs" >
                        {headInputs}
                    </div>
                    <div style={{ clear: "both" }}></div>
                </div>
                <div style={{marginTop: 15}}>
                    <div style={{display: "inline-block", background: "#FBB", padding: "5px"}}>
                        <div className="Menu-loadScene">
                            <label>Import Scene:</label>
                            <input style={{width: 200}} placeholder="Scene Url" value={this.state.sceneUrl} onChange={this.setLoadSceneUrl}/>&nbsp;
                            <button onClick={this.loadScene}>Load</button>&nbsp;<button onClick={this.loadLocalSceneJson}>Local URL</button>
                        </div><div className="Menu-getScene">
                            <label>Export Scene:</label>
                            <input id="clipboard-input" style={{width: 200}} placeholder="This will be populated on 'Copy to clipboard'." onChange={this.setLoadSceneUrl}/>&nbsp;
                            <button onClick={this.exportSceneToJSON}>Copy to clipboard</button>
                            <span id="clipboard-msg"></span>
                        </div>
                    </div>
                    <div style={{display: "inline-block", background: "#BFB", padding: "5px"}}>
                        <div className="Menu-loadScene">
                            <label style={transformLabelStyles}>Scale Scene:</label>
                            <input type="number" style={{width: 100}} placeholder="Scale" value={scale} onChange={this.setScale}/>&nbsp;
                        </div><div className="Menu-getScene">
                            <label style={transformLabelStyles}>Translate Scene:</label>
                            <input type="number" style={{width: 45}} placeholder="x" value={translateX} onChange={this.setTranslateX}/>&nbsp;
                            <input type="number" style={{width: 45}} placeholder="y" value={translateY} onChange={this.setTranslateY}/>&nbsp;
                        </div>
                    </div>
                    <div style={{display: "inline-block", background: "#BBF", padding: "5px"}}>
                        <div className="Menu-websocket">
                            <label>Websocket Url:</label><span id="websocket-msg"></span>
                            <input type="text" style={{width: 200}} placeholder="Websocket Url" value={this.state.websocketUrl} onChange={this.setWebsocketUrl}/>&nbsp;
                        </div>
                        <div className="Menu-websocket">
                            <button onClick={this.websocketConnect}>Connect</button>&nbsp;
                            <button onClick={this.websocketLoadLocalhostUrl}>Autofill localhost:8081</button>&nbsp;
                            {/* <button onClick={this.websocketLoadOtherUrl}>Other URL</button>&nbsp; */}
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={this.props.menuToggleHideRotates}>{areRotatesHidden ? "Show" : "Hide"} Rotates</button>
                    {/* <button>Toggle visuals</button> */}
                </div>
            </div>
        )
    }
}