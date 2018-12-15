### React-Morphable

[View the Demo](https://arnaudambro.github.io/react-morphable/)

A simple div that can be resized, rotated and / or dragged.

You can either use the `<Morphable>` element directly, without taking care about the position / size / rotation state of the div (while still getting access to it), or `<MorphableCore>` if you want the control of position / size / rotation state.

### Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-morphable

### Usage

```js
const `<Morphable>` = require('react-morphable').Morphable; // or,
const `<MorphableCore>` = require('react-morphable').MorphableCore;

// ES6
import { Morphable, MorphableCore } from 'react-morphable';

// ...
render() {
  return (
    <Morphable>
      // children
    </Morphable>
  );

  // or

  return (
    <MorphableCore
      position={this.state.position}
      size={this.state.size}
      rotation={this.state.rotation}
    >
      // children
    </MorphableCore>
  );

}
```

### Props

These props apply only to `<MorphableCore>`.

Prop | Type | Default
--- | --- | ---
position | `{ width: number, height: number }` | `{ width: 150, height: 150 }` 
size | `{ x: number, y: number }` | `{ x: 0, y: 0}` 
rotation | `number` | 0 

These props apply to both `<MorphableCore>` and `<Morphable>`.
Note regarding CSS classes : `react-morphable` uses `React-JSS`, therefore it's not feasible to edit directly the class of a `div` as the class name is not fixed. That's why the prop `classProps` has been added (`classes` prop is already taken by `react-JSS`, we couldn't use it), thanks to which you can give any class name you want to any HTML element inside `react-morphable`, allowing to customize anything.

Prop | Type | Default
--- | --- | ---
**children** | `React.Element` | *any*
**isMorphable** | `bool` | *true*
**lockAspectRatio** | `bool` | *false*
**disableDrag** | `bool` | *false*
**disableResize** | `bool` | *false*
**disableRotation** | `bool` | *false*
**disableGuides** | `bool` | *true*
**disableBounds** | `{forDrag: forResize: true}` | {forDrag: *true*, forResize: *true (always, not yet set-up)*}
**bounds** | `{top: left: bottom: right: }` | { top: 0, left: 0, bottom: 0, right: 0 }
**magnetismGrids** | `{ drag: resize: rotation: }` | ` { drag: 5, resize: 5, rotation: 5 }`
**debug** | `bool` | *false*
**onHandleMouseDown** | `func({ e })` | *void*
**onDragStart** | `func({ e })` | *void*
**onDrag** | `func({ e, x, y })` | *void*
**onDragStop** | `func({ e })` | *void*
**onResizeStart** | `func({ e })` | *void*
**onResize** | `func({ e, x, y, width, height })` | *void*
**onResizeStop** | `func({ e })` | *void*
**onRotateStart** | `func({ e })` | *void*
**onRotate** | `func({ e, rotation })` | *void*
**onRotateEnd** | `func({ e })` | *void*
**styles** |   { root: , rootTransformed: , corner: , topLeftCorner: , topRightCorner: , bottomLeftCorner: , bottomRightCorner: , middleTopCorner: , middleRightCorner: , middleBottomCorner: , middleLeftCorner: , middleTopAboveCorner: } | *void*
**classProps** |   { root: , rootTransformed: , corner: , topLeftCorner: , topRightCorner: , bottomLeftCorner: , bottomRightCorner: , middleTopCorner: , middleRightCorner: , middleBottomCorner: , middleLeftCorner: , middleTopAboveCorner: } | *void*

### To-do

- [x] styles
- [x] classes
- [x] bounds for drag
- [ ] bounds for resize
- [ ] minimum height, minimum width
- [ ] accessibility
- [ ] refactoring ?



