// https://redux.js.org/basics/exampletodolist#entry-point
// http://localhost:3000/

import React from "react";
// import { fromJS } from 'immutable';
// import Slider, { Range } from 'rc-slider';
import Slider from 'rc-slider';
import axios from 'axios';
let exportSceneMsgTimeout;

let defaultWebsocketUrl;
let defaultSceneUrl;
if (
    window.location.hostname === "localhost" &&
    window.location.port === "3000"
) {
    defaultWebsocketUrl = "ws://localhost:8081/ws";
    defaultSceneUrl = "json/temp.json";
} else {
    defaultWebsocketUrl =
        "ws://" + window.location.hostname + ":" + window.location.port + "/ws";
    defaultSceneUrl = "/installation/dev/scene.json";
}

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sceneUrl: defaultSceneUrl,
            // sceneUrl : "/build/json/temp.json",
            websocketUrl: defaultWebsocketUrl //"ws://localhost:8081/ws"
            // sceneUrl : "/json/temp.json"
            // sceneUrl : "/json/temp2.json"
        };

        this.deselectStand = this.deselectStand.bind(this);
        this.addFocalPoint = this.addFocalPoint.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.setLoadSceneUrl = this.setLoadSceneUrl.bind(this);
        this.loadScene = this.loadScene.bind(this);
        this.loadTempSceneJson = this.loadTempSceneJson.bind(this);
        this.loadRegSceneJson = this.loadRegSceneJson.bind(this);

        this.addNewCamera = this.addNewCamera.bind(this);
        this.removeCurrentCamera = this.removeCurrentCamera.bind(this);
        this.exportSceneToJSON = this.exportSceneToJSON.bind(this);
        this.setScale = e => {
            props.setScale(e.target.value);
        };
        this.setTranslateX = e => {
            props.setTranslateX(e.target.value);
        };
        this.setTranslateY = e => {
            props.setTranslateY(e.target.value);
        };

        // Focal Point
        this.addFocalPoint = this.addFocalPoint.bind(this);

        this.setWebsocketUrl = e => {
            this.setState({ websocketUrl: e.target.value });
        };
        this.websocketConnect = this.websocketConnect.bind(this);
        this.websocketDisconnect = this.websocketDisconnect.bind(this);
        this.websocketLoadLocalhostUrl = this.websocketLoadLocalhostUrl.bind(
            this
        );
        this.websocketLoadOtherUrl = this.websocketLoadOtherUrl.bind(this);
        this.setAnchorDistancesRound = this.setAnchorDistancesRound.bind(this);
        this.setAnchorDistancesUnit = this.setAnchorDistancesUnit.bind(this);
    }

    componentDidMount() {
        this.loadScene();
        this.websocketConnect();
    }

    deselectStand() {
        // this.props.deselectStand({})
        this.props.menuDeselectStandAndPopupInfoAll();
    }

    addFocalPoint() {
        this.props.addFocalPoint({});
    }

    setLoadSceneUrl(e) {
        const sceneUrl = e.target.value;
        this.setState({ sceneUrl });
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

    loadTempSceneJson() {
        this.setState({
            sceneUrl: "json/temp.json"
        });
    }

    loadRegSceneJson() {
        this.setState({
            sceneUrl: "/installation/dev/scene.json"
        });
    }

    addNewCamera() {
        this.props.cameraAddNew(this.props.selectedStandIndex);
    }

    removeCurrentCamera() {
        console.log("c_ 12");
        this.props.cameraRemove(
            this.props.selectedStandIndex,
            this.props.selectedCameraIndex
        );
    }

    // Web socket connection
    websocketConnect() {
        this.props.websocketConnect(this.state.websocketUrl);
    }

    websocketDisconnect() {
        this.props.websocketDisconnect();
    }

    websocketLoadLocalhostUrl() {
        this.setState({
            websocketUrl: "ws://localhost:8081/ws"
        });
    }

    websocketLoadOtherUrl() {}

    setAnchorDistancesRound(event) {
        const value = event.target.value;
        this.props.menuSetAnchorDistancesRound(value);
    }

    setAnchorDistancesUnit(event) {
        const value = event.target.value;
        this.props.menuSetAnchorDistancesUnit(value);
    }

    handleRestart() {
        const url = `http://${document.location.hostname}:8000/restart?service=boss`;
        axios.get(url);
    }

    handleStop() {
        const url = `http://${document.location.hostname}:8000/stop?service=boss`;
        axios.get(url);
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
            name: { type: "text" },
            pos: {
                type: "pos"
                // type: "obj",
                // obj : {
                //     x: {type: 'number'},
                //     y: {type: 'number'}
                // }
            },
            rot: { type: "number", min: -1 * Math.PI, max: Math.PI }
        };

        const cameraSchema = {
            name: { type: "text" },
            pos: {
                type: "pos"
                // type: "obj",
                // obj : {
                //     x: {type: 'number'},
                //     y: {type: 'number'}
                // }
            },
            rot: { type: "number", min: -1 * Math.PI, max: Math.PI },
            fov: { type: "number" },
            description: { type: "text" }

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
            name: { type: "text" },
            pos: {
                type: "pos"
                // type: "obj",
                // obj: {
                //     "x": { type: "number" },
                //     "y": { type: "number" }
                // }
            },
            rot: { type: "number", min: -1 * Math.PI, max: Math.PI }
        };

        // `fieldNames` param is of type array. e.g. fieldNames = [0, "heads", 0, "rot"]
        const inputHandler = fieldNames => {
            return e => {
                const value = e.target.value;

                this.props.standSetInFields(
                    this.props.selectedStandIndex,
                    fieldNames,
                    value
                );
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
            return e => {
                let value = parseFloat(e.target.value);
                if (isNaN(value)) {
                    value = "";
                }

                // console.log("====", this.props.selectedStandIndex, fieldName, axis, value);
                this.props.standSetInFields(
                    this.props.selectedStandIndex,
                    [...fieldNames, axis],
                    value
                );
            };
        };

        // const getTextInput = ({label, name, value, onChange}) => {
        const getTextInput = ({ fieldName, fieldVal, parentFieldNames }) => {
            return getInput({
                fieldName,
                fieldVal,
                type: "text",
                parentFieldNames
            });
        };

        const getNumberInput = ({ fieldName, fieldVal, parentFieldNames }) => {
            return getInput({
                fieldName,
                fieldVal,
                type: "number",
                parentFieldNames
            });
        };

        const getPosInput = ({ fieldName, fieldVal, parentFieldNames }) => {
            const { x, y } =
                fieldVal && fieldVal.toJS ? fieldVal.toJS() : { x: 0, y: 0 };
            const fieldNameX = `${fieldName}.x`;
            const fieldNameY = `${fieldName}.y`;

            window.c_sdfa2 = { fieldName, fieldVal };

            const fieldNames = [...parentFieldNames, fieldName];

            return (
                <div className="Menu-form-posType">
                    <label>X</label>
                    <input
                        className="Menu-form-posType-X"
                        name={fieldNameX}
                        type="number"
                        onChange={posHandler(fieldNames, "x")}
                        value={x}
                    />
                    <label style={{ minWidth: 0 }}>Y</label>
                    <input
                        className="Menu-form-posType-Y"
                        name={fieldNameY}
                        type="number"
                        onChange={posHandler(fieldNames, "y")}
                        value={y}
                    />
                </div>
            );
        };

        const getInput = ({ fieldName, fieldVal, type, parentFieldNames }) => {
            const fieldNames = [...parentFieldNames, fieldName];
            return (
                <div>
                    <label htmlFor={fieldName}>{fieldName}</label>
                    <input
                        name={fieldName}
                        type={type}
                        onChange={inputHandler(fieldNames)}
                        value={fieldVal}
                    />
                </div>
            );
        };

        // Got through each for schema... then get associated to object
        // The parent field names is in case the onChange needs to pass along more field names for the stand
        const getInputsBySchema = ({
            schema,
            immutableObj,
            parentFieldNames = []
        }) => {
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
                        return (
                            <span key={fieldName}>
                                {getTextInput({
                                    fieldName,
                                    fieldVal,
                                    parentFieldNames
                                })}
                            </span>
                        );
                    case "number":
                        return (
                            <span key={fieldName}>
                                {getNumberInput({
                                    fieldName,
                                    fieldVal,
                                    parentFieldNames
                                })}
                            </span>
                        );
                    // case "array":
                    //     break;
                    case "pos":
                        return (
                            <span key={fieldName}>
                                {getPosInput({
                                    fieldName,
                                    fieldVal,
                                    parentFieldNames
                                })}
                            </span>
                        );
                    case "obj":
                        return <div key={fieldName}>OBJ - {fieldName}</div>;
                    default:
                        return null;
                }
            });
        };

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
                    };
                }
            }

            return {
                selectedStand: {},
                cameras: [],
                heads: []
            };
        };

        const { selectedStand, cameras, heads } = getStandInfo();

        let standOptions = stands.map((stand, i) => {
            return (
                <option key={i} value={i}>
                    {i} - {stand.get("name")}
                </option>
            );
        });

        let defaultStandOption = (
            <option key={"no selection"} value="">
                None selected
            </option>
        );

        standOptions = [defaultStandOption].concat(standOptions);

        let cameraOptions;
        if (cameras) {
            cameraOptions = cameras.map((camera, i) => {
                return (
                    <option key={i} value={i}>
                        {i} - {camera.get("name")}
                    </option>
                );
            });
        }

        const headOptions = heads.map((head, i) => {
            return (
                <option key={i} value={i}>
                    {i} - {head.get("name")}
                </option>
            );
        });

        const getStandForm = () => {
            return getInputsBySchema({
                schema: standSchema,
                immutableObj: selectedStand
            });
        };

        const getHeadForm = () => {
            const selectedHead =
                heads && heads.get ? heads.get(selectedHeadIndex) : undefined;
            if (selectedHead !== undefined) {
                return getInputsBySchema({
                    schema: headSchema,
                    immutableObj: selectedHead,
                    parentFieldNames: ["heads", selectedHeadIndex]
                });
            } else {
                return undefined;
            }
        };

        const getCameraForm = () => {
            const selectedCamera =
                cameras && cameras.get
                    ? cameras.get(selectedCameraIndex)
                    : undefined;
            if (selectedCamera !== undefined) {
                return getInputsBySchema({
                    schema: cameraSchema,
                    immutableObj: selectedCamera,
                    parentFieldNames: ["cameras", selectedCameraIndex]
                });
            } else {
                return undefined;
            }
        };

        const standInputs = getStandForm();

        const headInputs = getHeadForm();

        const cameraInputs = getCameraForm();

        const isStandRotatesHidden = this.props.menu.get(
            "isStandRotatesHidden"
        );
        const isCameraRotatesHidden = this.props.menu.get(
            "isCameraRotatesHidden"
        );
        const isHeadRotatesHidden = this.props.menu.get("isHeadRotatesHidden");

        const isForceShowStandRotatesOnSelect = this.props.menu.get(
            "isForceShowStandRotatesOnSelect"
        );
        const isForceShowHeadRotatesOnSelect = this.props.menu.get(
            "isForceShowHeadRotatesOnSelect"
        );
        const isForceShowCameraRotatesOnSelect = this.props.menu.get(
            "isForceShowCameraRotatesOnSelect"
        );

        const transformLabelStyles = { width: 120 };

        const anchorDistancesRound = this.props.menu.get(
            "anchorDistancesRound"
        );

        // Websocket connection buttons
        const websocketStatus = this.props.menu.get("websocketStatus");
        let websocketConnectionButton;

        if (websocketStatus === "open") {
            websocketConnectionButton = (
                <button onClick={this.websocketDisconnect}>Disconnect</button>
            );
        } else if (websocketStatus === "connecting") {
            websocketConnectionButton = (
                <button disabled={true}>Connecting</button>
            );
        } else {
            websocketConnectionButton = (
                <button onClick={this.websocketConnect}>Connect</button>
            );
        }

        // Inputs for stand, head, camera
        let standDetails;

        if (selectedStandIndex >= 0) {
            standDetails = (
                <div>
                    <div className="Menu-section Menu-section--stand">
                        <div>
                            <label className="Menu-form-label">Stand</label>
                            <br />
                            <select
                                value={selectedStandIndex}
                                onChange={e =>
                                    this.props.selectStand(e.target.value)
                                }
                            >
                                {standOptions}
                            </select>
                        </div>
                    </div>
                    <div className="Menu-section Menu-section--standInputs">
                        {standInputs}
                    </div>
                    <div
                        className="Menu-section Menu-section--camera"
                        style={{ paddingLeft: "20px", float: "left" }}
                    >
                        <div>
                            <label className="Menu-form-label">Camera</label>
                            <br />
                            <select
                                value={selectedCameraIndex}
                                onChange={e =>
                                    this.props.selectCamera(e.target.value)
                                }
                            >
                                {cameraOptions}
                            </select>
                        </div>
                        {/* <div>
                            <button onClick={this.addNewCamera}>Add New</button>
                        </div>
                        <div>
                            <button onClick={this.removeCurrentCamera}>Remove Current</button>
                        </div> */}
                    </div>
                    <div className="Menu-section Menu-section--cameraInputs">
                        {cameraInputs}
                    </div>

                    <div
                        className="Menu-section Menu-section--head"
                        style={{ paddingLeft: "20px", float: "left" }}
                    >
                        <div>
                            <label className="Menu-form-label">Head</label>
                            <br />
                            <select
                                value={this.props.menu.get("selectedHeadIndex")}
                                onChange={e =>
                                    this.props.selectHead(e.target.value)
                                }
                            >
                                {headOptions}
                            </select>
                        </div>
                    </div>
                    <div className="Menu-section Menu-section--headInputs">
                        {headInputs}
                    </div>
                </div>
            );
        }

        // Focal Point details
        let focalPointDetails;

        return (
            <div className="Menu">
                <div className="Menu-zoomer">
                    <div className="Menu-zoomer-scale">
                        <Slider
                            min={1}
                            max={400}
                            vertical={true}
                            onChange={this.props.setScale}
                            value={parseFloat(scale)}
                        />
                    </div>
                    <div className="Menu-zoomer-translateY">
                        <Slider
                            min={-3000}
                            max={3000}
                            vertical={true}
                            onChange={val => this.props.setTranslateY(val)}
                            value={parseFloat(translateY)}
                        />
                    </div>
                    <div className="Menu-zoomer-translateX">
                        <Slider
                            min={-1500}
                            max={3000}
                            onChange={this.props.setTranslateX}
                            value={parseFloat(translateX)}
                        />
                    </div>
                </div>
                <div>
                    {/* <div className="Menu-section">
                        <div className="Menu-bigButton" onClick={this.addStand}>Add Stand</div>
                    </div> */}
                    <div className="Menu-section">
                        <button className="Menu-bigButton" onClick={this.addFocalPoint}>Add Focal Point</button>
                        {/* <div className="Menu-bigButton" onClick={this.addFocalPoint}>Add Focal Point</div> */}
                    </div>
                    <div className="Menu-section">
                        <button className="Menu-bigButton" onClick={this.handleRestart}>Restart</button>
                    </div>
                    <div className="Menu-section">
                        <button className="Menu-bigButton" onClick={this.handleStop}>Stop</button>
                    </div>
                    {standDetails}
                    {focalPointDetails}
                    <div style={{ clear: "both" }} />
                </div>
                <div style={{ marginTop: 15 }}>
                    <div
                        style={{
                            display: "inline-block",
                            background: "#FBB",
                            padding: "5px"
                        }}
                    >
                        <div className="Menu-loadScene">
                            <label>Import Scene:</label>
                            <input
                                style={{ width: 200 }}
                                placeholder="Scene Url"
                                value={this.state.sceneUrl}
                                onChange={this.setLoadSceneUrl}
                            />
                            &nbsp;
                            <button onClick={this.loadScene}>Load</button>&nbsp;
                            <button onClick={this.loadTempSceneJson}>
                                Temp
                            </button>
                            &nbsp;
                            <button onClick={this.loadRegSceneJson}>Reg</button>
                        </div>
                        <div className="Menu-getScene">
                            <label>Export Scene:</label>
                            <input
                                id="clipboard-input"
                                style={{ width: 200 }}
                                placeholder="This will be populated on 'Copy to clipboard'."
                            />
                            &nbsp;
                            <button onClick={this.exportSceneToJSON}>
                                Copy to clipboard
                            </button>
                            <span id="clipboard-msg" />
                        </div>
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            background: "#BFB",
                            padding: "5px"
                        }}
                    >
                        <div className="Menu-scaleScene">
                            <label style={transformLabelStyles}>
                                Scale Scene:
                            </label>
                            <input
                                type="number"
                                style={{ width: 100 }}
                                placeholder="Scale"
                                value={scale}
                                onChange={this.setScale}
                            />
                            &nbsp;
                        </div>
                        <div className="Menu-translateScene">
                            <label style={transformLabelStyles}>
                                Translate Scene:
                            </label>
                            <input
                                type="number"
                                style={{ width: 45 }}
                                placeholder="x"
                                value={translateX}
                                onChange={this.setTranslateX}
                            />
                            &nbsp;
                            <input
                                type="number"
                                style={{ width: 45 }}
                                placeholder="y"
                                value={translateY}
                                onChange={this.setTranslateY}
                            />
                            &nbsp;
                        </div>
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            background: "#BBF",
                            padding: "5px"
                        }}
                    >
                        <div className="Menu-websocket">
                            <label>Websocket Url:</label>
                            <span id="websocket-msg" />
                            <br />
                            <input
                                type="text"
                                style={{ width: 200 }}
                                placeholder="Websocket Url"
                                value={this.state.websocketUrl}
                                onChange={this.setWebsocketUrl}
                            />
                            &nbsp;
                            {websocketConnectionButton}&nbsp;
                            <button onClick={this.websocketLoadLocalhostUrl}>
                                Autofill localhost:8081
                            </button>
                            &nbsp;
                            {/* <button onClick={this.websocketLoadOtherUrl}>Other URL</button>&nbsp; */}
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "inline-block",
                        background: "#FFFFEE",
                        padding: "5px"
                    }}
                >
                    Show Rotates:&nbsp;
                    {/* <button onClick={this.props.menuToggleHideHeadRotates}>{isStandRotatesHidden ? "Show" : "Hide"} Stand</button>
                    <button onClick={this.props.menuToggleHideCameraRotates}>{isCameraRotatesHidden ? "Show" : "Hide"} Camera</button>
                    <button onClick={this.props.menuToggleHideStandRotates}>{isHeadRotatesHidden ? "Show" : "Hide"} Head</button>
                    <button onClick={this.props.menuToggleHideStandRotates}>{isHeadRotatesHidden ? "Show" : "Hide"} Head</button> */}
                    Stand
                    <input
                        name="Stand"
                        type="checkbox"
                        checked={!isStandRotatesHidden}
                        onChange={this.props.menuToggleHideStandRotates}
                    />
                    &nbsp; Head
                    <input
                        name="Head"
                        type="checkbox"
                        checked={!isHeadRotatesHidden}
                        onChange={this.props.menuToggleHideHeadRotates}
                    />
                    &nbsp; Camera
                    <input
                        name="Camera"
                        type="checkbox"
                        checked={!isCameraRotatesHidden}
                        onChange={this.props.menuToggleHideCameraRotates}
                    />
                    &nbsp;
                    <button onClick={this.props.menuShowAllRotates}>
                        Show All
                    </button>
                    <button onClick={this.props.menuHideAllRotates}>
                        Hide All
                    </button>
                    {/* <button>Toggle visuals</button> */}
                </div>
                <div
                    style={{
                        display: "inline-block",
                        background: "#EEFFFF",
                        padding: "5px"
                    }}
                >
                    Show Distances:&nbsp;
                    {this.props.menu.get("isShowDistances") ? (
                        <button onClick={this.props.menuShowAllDistances}>
                            Hide All
                        </button>
                    ) : (
                        <button onClick={this.props.menuHideAllDistances}>
                            Show All
                        </button>
                    )}
                    <label>Round</label>
                    <input
                        type="number"
                        style={{ width: 30 }}
                        placeholder="round"
                        value={anchorDistancesRound}
                        onChange={this.setAnchorDistancesRound}
                    />
                    <select value={this.props.menu.get("menuAnchorDistancesUnit")} onChange={this.setAnchorDistancesUnit}>
                        <option value="feet">Feet/Inches</option>
                        <option value="meters">Meters</option>
                    </select>
                    &nbsp;
                    <button onClick={this.props.popupInfoClearAllStandAnchors}>Clear Stand Anchors</button>
                </div>
                <div
                    style={{
                        display: "inline-block",
                        background: "#FFEEFF",
                        padding: "5px"
                    }}
                >
                    Force Show On Select:&nbsp; Stand
                    <input
                        name="Stand"
                        type="checkbox"
                        checked={isForceShowStandRotatesOnSelect}
                        onChange={
                            this.props.menuToggleForceShowStandRotatesOnSelect
                        }
                    />
                    &nbsp; Head
                    <input
                        name="Head"
                        type="checkbox"
                        checked={isForceShowHeadRotatesOnSelect}
                        onChange={
                            this.props.menuToggleForceShowHeadRotatesOnSelect
                        }
                    />
                    &nbsp; Camera
                    <input
                        name="Camera"
                        type="checkbox"
                        checked={isForceShowCameraRotatesOnSelect}
                        onChange={
                            this.props.menuToggleForceShowCameraRotatesOnSelect
                        }
                    />
                    &nbsp;
                    <button
                        onClick={
                            this.props.menuEnableForceShowAllRotatesOnSelect
                        }
                    >
                        Show All
                    </button>
                    <button
                        onClick={
                            this.props.menuDisableForceShowAllRotatesOnSelect
                        }
                    >
                        Hide All
                    </button>
                </div>
            </div>
        );
    }
}
