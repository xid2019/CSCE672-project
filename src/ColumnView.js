import React from 'react'
import { Box } from '@mui/system';
import { v4 as uuidv4 } from 'uuid';
import ColumnTask from './ColumnTask.js';
function groupBy(arr, property) {
    return arr.reduce(function(memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
    }, {});
}

const ColumnView = ({todos}) => {
    // put todos into subarrays depending on progress
    const todo_list = groupBy(todos, 'status')
    const todo_list_key = Object.keys(todo_list);
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            {todo_list_key.map((key, index) => {
                console.log(todo_list[key])
                return (
                    <ColumnTask todos={todo_list[key]} />
                )
            })}
        </Box>
    )
}

export default ColumnView