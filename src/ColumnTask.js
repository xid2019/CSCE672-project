import React from 'react'
import { Box } from '@mui/system';
import { Paper, Typography } from '@mui/material';
import TodoCard from "./TodoCard";

const ColumnTask = ({todos, title}) => {
    return (
        <Paper sx={{ marginRight: 2, flexGrow: 0, flexShrink: 0, width: 375 }}>
            <Typography sx={{ fontFamily:'Arial', fontWeight: 'bold', color:'#667085', margin: 1.5, marginBottom: 0 }}>
                {title.toUpperCase()}
            </Typography>
            {todos && 
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {todos.map((todo, index) => {
                        return (<TodoCard todo={todo} index={index} key={todo.task_id}/>)
                    })}
                </Box>
            }    
        </Paper>
    )
    
}

export default ColumnTask