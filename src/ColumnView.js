import React from 'react'
import TodoCard from "./TodoCard";
import { Box } from '@mui/system';

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
    console.log(todo_list)
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {todos.map((todo, index) => {
                    let color;
                    if (todo.deadline) {
                        const deadline = new Date(todo.deadline);
                            if (deadline < new Date()){
                                color = 'red'
                            }
                    }
                    return (
                        <TodoCard todo={todo} key={index} index={index}/>
                    );
                })}
            </Box>
            
        </Box>
    )
}

export default ColumnView