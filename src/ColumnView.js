import React from 'react'
import { Box } from '@mui/system';
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
    const todo_list_key = ['Not Started', 'In Progress', 'Testing', 'Completed', 'Canceled']// Object.keys(todo_list);
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: 2, justifyContent: 'flex-start', overflow:'scroll' }}>
            {todo_list_key.map((key, index) => {
                return ( <ColumnTask todos={todo_list[key]} title={key} key={index}/> )
            })}
        </Box>
    )
}

export default ColumnView