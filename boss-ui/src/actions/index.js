// let nextTodoId = 0
// export const addTodo = text => ({
//     type: 'ADD_TODO',
//     id: nextTodoId++,
//     text
// })

// export const setVisibilityFilter = filter => ({
//     type: 'SET_VISIBILITY_FILTER',
//     filter
// })

// export const toggleTodo = id => ({
//     type: 'TOGGLE_TODO',
//     id
// })

// export const StandsActions = {
//     SHOW_ALL: 'SHOW_ALL',
//     SHOW_COMPLETED: 'SHOW_COMPLETED',
//     SHOW_ACTIVE: 'SHOW_ACTIVE'
// }

// Menu 

export const menuSelectStand = index => ({
    type: 'MENU_SELECT_STAND',
    index
})

export const menuSelectCamera = (standIndex, cameraIndex) => ({
    type: 'MENU_SELECT_CAMERA',
    standIndex, 
    cameraIndex
})

export const menuSelectHead = (standIndex, headIndex) => ({
    type: 'MENU_SELECT_HEAD',
    standIndex, 
    headIndex
})

// Stands

export const standAdd = options => ({
    type: 'STAND_ADD',
    options
})

export const standSetFieldByIndex = (standIndex, fieldName, value) => ({
    type: 'STAND_SET_FIELD_BY_INDEX',
    index : standIndex,
    fieldName,
    value
});

export const standSetInFieldsByIndex = (standIndex, fieldNames, value) => ({
    type: 'STAND_SETIN_FIELDS_BY_INDEX',
    index : standIndex,
    fieldNames,
    value
});

export const standMoveByIndex = (standIndex, pos) => ({
    type: 'STAND_MOVE_BY_INDEX',
    index : standIndex,
    pos
})
export const standRotateByIndex = (standIndex, rot) => ({
    type: 'STAND_ROTATE_BY_INDEX',
    index: standIndex,
    rot
})

export const standRemoveByIndex = index => ({
    type: 'STAND_REMOVE_BY_INDEX',
    index
})

// Heads

// export const standAdd = options => ({
//     type: 'STAND_ADD',
//     options
// })

// export const standSetFieldByIndex = (standIndex, fieldName, value) => ({
//     type: 'STAND_SET_FIELD_BY_INDEX',
//     index : standIndex,
//     fieldName,
//     value
// });

// export const standSetInFieldsByIndex = (standIndex, fieldNames, value) => ({
//     type: 'STAND_SETIN_FIELDS_BY_INDEX',
//     index : standIndex,
//     fieldNames,
//     value
// });

export const headMoveByIndex = (standIndex, headIndex, pos) => ({
    type: 'HEAD_MOVE_BY_INDEX',
    standIndex : standIndex,
    headIndex : headIndex,
    pos
})

export const headRotateByIndex = (standIndex, headIndex, rot) => ({
    type: 'HEAD_ROTATE_BY_INDEX',
    standIndex,
    headIndex,
    rot
})

// export const standRemoveByIndex = index => ({
//     type: 'STAND_REMOVE_BY_INDEX',
//     index
// })