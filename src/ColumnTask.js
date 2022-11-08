import React from 'react'
import { Box } from '@mui/system';
import TodoCard from "./TodoCard";

const ColumnTask = ({todos}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#d3e0f3' }}>
            {todos.map((todo, index) => {
                let color;
                if (todo.deadline) {
                    const deadline = new Date(todo.deadline);
                        if (deadline < new Date()){
                            color = 'red'
                        }
                }
                return (
                    <TodoCard todo={todo} key={uuidv4()} index={index}/>
                );
            })}
        </Box>
    )
}

export default ColumnTask