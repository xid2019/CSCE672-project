import React from 'react'
import { Box } from '@mui/system';
import { Paper, Typography } from '@mui/material';
import TodoCard from "./TodoCard";
import { v4 as uuidv4 } from 'uuid';

const ColumnTask = ({todos, title}) => {
    return (
        <Paper sx={{ marginRight: 2 }}>
            <Typography sx={{ fontFamily:'Geneva', color:'#667085', margin: 1.5, marginBottom: 0 }}>
                {title.toUpperCase()}
            </Typography>
            {todos && 
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
                            <TodoCard todo={todo} index={index}/>
                        );
                    })}
                </Box>
            }    
        </Paper>
    )
    
}

export default ColumnTask