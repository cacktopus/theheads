// https://redux.js.org/basics/exampletodolist#entry-point
// http://localhost:3000/

import React from 'react'
// import { fromJS } from 'immutable';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.addStand = this.addStand.bind(this);
    }

    addStand() {
        this.props.addStand({})
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
        /*
        const cameraSchema = {
            "name" : {type: "text"},
            "pos": {
                type: "pos"
                // type: "obj",
                // obj: {
                //     "x": { type: "number" },
                //     "y": { type: "number" }
                // }
            },
            "rot": { type: "number", min: -1 * Math.PI, max: Math.PI },
            "fov": { type: "number" },
            "description": { type: "text" }
        };
        */
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
                console.log(fieldNames, value);
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
                    <label htmlFor={fieldNameY}>Y</label>
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

        window.c_sdfas = this;

        const stands = this.props.stands;
        const menu = this.props.menu;
        const selectedStandIndex = this.props.selectedStandIndex;
        const selectedHeadIndex = menu.get("selectedHeadIndex");
        // const selectedCameraIndex = menu.get("selectedCameraIndex");

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

        // const getCameraInfo = (cameras) => {
        //     if (cameras.size > 0 && cameras.get) {
        //         const camera = cameras.get(selectedCameraIndex);
        //         if (stand) {
        //             return {
        //                 cameraName : stand.get("name"),
        //                 cameraPosX : stand.getIn(["pos","x"]),
        //                 cameraPosY : stand.getIn(["pos","y"]),
        //                 cameraRot : stand.get("rot"),
        //                 cameraFov : stand.get("fov"),
        //                 cameraDescription : stand.get("description"),
        //             }
        //         } 
        //     }

        //     return {};
        // }

        // const getHeadInfo = (heads) => {
        //     if (heads.size > 0 && heads.get) {
        //         const head = heads.get(selectedHeadIndex);
        //         if (stand) {
        //             return {
        //                 headName : stand.get("name"),
        //                 headPosX : stand.getIn(["pos","x"]),
        //                 headPosY : stand.getIn(["pos","y"]),
        //                 headRot : stand.get("rot"),
        //             }
        //         } 
        //     }

        //     return {};
        // }


        const { selectedStand, cameras, heads } = getStandInfo();
        window.c_23432 = { selectedStand, cameras, heads };
        // const { cameraName, cameraPos, cameraRot, cameraFov, cameraDescription } = getCameraInfo(cameras);
        // const { headName, cameraPos, cameraRot, cameraFov, cameraDescription } = getCameraInfo(cameras);

        // const cameras = stands.size > 0 && selectedStand >= 0 ? stands.get(selectedStand).get("cameras") : [];
        // const heads = stands.size > 0 && selectedStand >= 0 ? stands.get(selectedStand).get("heads") : [];

        const standOptions = stands.map((stand, i) => {
            return <option key={i} value={i}>{i} - {stand.get("name")}</option>
        });

        const cameraOptions = cameras.map((camera, i) => {
            return <option key={i} value={i}>{i} - {camera.getIn(["name"])}</option>
        });

        const headOptions = heads.map((head, i) => {
            return <option key={i} value={i}>{i} - {head.getIn(["name"])}</option>
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

        const standInputs = getStandForm();
        // window.c_oo2 = {standInputs, selectedStandIndex, cameras, heads, standSchema, selectedStand};

        const headInputs = getHeadForm();

        return (
            <div className="Menu">
                <div className="Menu-section">
                    <div className="Menu-addStandButton" onClick={this.addStand}>Add Stand</div>
                </div>
                <div className="Menu-section">
                    <div>
                        <label className="Menu-form-label">Stand</label><br />
                        <select value={selectedStandIndex} onChange={(e) => this.props.selectStand(e.target.value)}>
                            {standOptions}
                        </select>
                    </div>
                </div>
                <div className="Menu-section" >
                    {standInputs}
                </div>
                <div className="Menu-section" style={{ paddingLeft: "20px", float: "left" }}>
                    <div>
                        <label className="Menu-form-label">Camera</label><br />
                        <select value={this.props.menu.get("selectedCameraIndex")} onChange={(e) => this.props.selectCamera(e.target.value)}>
                            {cameraOptions}
                        </select>
                    </div>
                </div>

                <div className="Menu-section" style={{ paddingLeft: "20px", float: "left" }}>
                    <div>
                        <label className="Menu-form-label">Head</label><br />
                        <select value={this.props.menu.get("selectedHeadIndex")} onChange={(e) => this.props.selectHead(e.target.value)}>
                            {headOptions}
                        </select>
                    </div>
                </div>
                <div className="Menu-section" >
                    {headInputs}
                </div>
                <div style={{ clear: "both" }}></div>
            </div>
        )
    }
}