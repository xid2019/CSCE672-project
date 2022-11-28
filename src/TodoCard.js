import React from 'react'
import { useState, Suspense } from "react";
import { RoomProvider, useOthers, useUpdateMyPresence, useMyPresence, useStorage, useMutation } from "./liveblocks.config";
import { LiveList } from "@liveblocks/client";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import TextField from "@mui/material/TextField";
import Select from '@mui/material/Select';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from '@mui/material/MenuItem';
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Badge from '@mui/material/Badge';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
}));

const TodoCard = (props) => {
    const {text, task_id, description, type, deadline, person, status, groupchat} = props.todo;
    const [properties, setProperties] = useState({text, task_id, description, type, deadline, person, status, groupchat});
    const [expanded, setExpanded] = useState(false);
    const [todoText, setTodoText] = useState("");
    const [todoDescription, setTodoDescription] = useState("");
    const [myPresence, updateMyPresence] = useMyPresence();
    
    const daysToDeadline = dayjs(deadline).diff(dayjs(),'day',true);

    const cardColor = (
        status === "Completed" ? '#B6E2A1' : // status completed
        status === "Canceled" ? '#65647C' : // status canceled
        daysToDeadline <= 0 ? '#FF9F9F' : // 过ddl变成xx色 
        daysToDeadline <= 3 ? '#FCDDB0' :// 离ddl小于3天变成xx色 
        '#e9ecef' // else 默认颜色
    );

    const badgeContent = (
        status === ("Completed" || "Canceled") ? "" : 
        daysToDeadline <= 0 ? "Past deadline" : 
        daysToDeadline <= 3 ? "Due soon" :
        ""
    );

    const modifyTodoProperty = useMutation(({storage}, task_id, property, draft) => {

        const modified_todo_index = storage.get("todos").findIndex((todo) => (todo.task_id === task_id));
        const updated_value = { [property]: draft };
        const temp_todo = {
            ...storage.get("todos").get(modified_todo_index),
            ...updated_value
        };
        
        storage.get("todos").set(modified_todo_index, temp_todo)
        setProperties(temp_todo)
    }, [])

    const deleteTodo = useMutation(({storage}, task_id) => {
        const modified_todo_index = storage.get("todos").findIndex((todo) => (todo.task_id === task_id));
        console.log('index is ', modified_todo_index)
        storage.get("todos").delete(modified_todo_index);
    }, [])

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345, bgcolor: cardColor, m:1, p:1 }}>
            <CardContent sx={{ justifyContent: "space-between", p:1 }}>
                <input type="text" placeholder="Edit Todo title here" value={todoText}
                    onChange={(e) => { 
                        // useState and backend seperate for text since we have two field to manage, one is edit box the other is actual text
                        setTodoText(e.target.value);
                        updateMyPresence({ isTyping: true });
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            updateMyPresence({ isTyping: false });
                            // only modify backend todo.text when hitting enter
                            modifyTodoProperty(task_id, 'text', todoText)
                            setTodoText("");
                        }}}
                    onBlur={() => updateMyPresence({ isTyping: false })}
                />
                {badgeContent ? 
                    <Badge badgeContent={badgeContent} color="secondary">
                        <Typography variant="h5" color="#1565c0">
                            {text}
                        </Typography>
                    </Badge> :
                    <Typography variant="h5" color="#1565c0">
                        {text}
                    </Typography>
                }
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between", p:0 }} disableSpacing>
                <IconButton>
                <AccessTimeIcon />
                <Typography>Deadline</Typography>
                </IconButton>
                <LocalizationProvider dateAdapter={AdapterDayjs}> 
                    <DateTimePicker
                        value={properties.deadline}
                        onChange={(newValue) => {
                            modifyTodoProperty(task_id, 'deadline', newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </CardActions>
            <CardActions sx={{ justifyContent: "space-between", p:0 }} disableSpacing>
                <IconButton>
                <CategoryIcon />
                <Typography>Task Type</Typography>
                </IconButton>
                <Select sx={{ width: 1/2 }} id="todoType" value={properties.type} onChange={(event) => {modifyTodoProperty(task_id, 'type', event.target.value)}}>
                    <MenuItem value="Features">Features</MenuItem>
                    <MenuItem value="Testing">Testing</MenuItem>
                    <MenuItem value="Styling">Styling</MenuItem>
                    <MenuItem value="Devops">Devops</MenuItem>
                    <MenuItem value="Bug fix">Bug fix</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                </Select>
            </CardActions>
            <CardActions sx={{ justifyContent: "space-between", p:0 }} disableSpacing>
                <IconButton>
                <PersonIcon />
                <Typography>Assigned To</Typography>
                </IconButton>
                <Select sx={{ width: 1/2 }} id="todoPerson" value={properties.person} onChange={(event) => {modifyTodoProperty(task_id, 'person', event.target.value)}}>
                    <MenuItem value="Nobody">Nobody</MenuItem>
                    <MenuItem value="Fengyi Wang">Fengyi Wang</MenuItem>
                    <MenuItem value="Jincheng Li">Jincheng Li</MenuItem>
                    <MenuItem value="Sibo Min">Sibo Min</MenuItem>
                    <MenuItem value="Xiaomu Dong">Xiaomu Dong</MenuItem>
                    <MenuItem value="Zihan Wang">Zihan Wang</MenuItem>
                </Select>
            </CardActions>
            <CardActions sx={{ justifyContent: "space-between", p:0 }} disableSpacing>
                <IconButton>
                <DonutLargeIcon />
                <Typography>Progress</Typography>
                </IconButton>
                <Select sx={{ width: 1/2 }} id="todoStatus" value={properties.status} onChange={(event) => {modifyTodoProperty(task_id, 'status', event.target.value)}}>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Testing">Testing</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Canceled">Canceled</MenuItem>
                </Select>
            </CardActions>
            <CardActions sx={{ justifyContent: "space-between", p:0 }} disableSpacing>
                <IconButton>
                <DescriptionIcon />
                <Typography>Details</Typography>
                </IconButton>
                <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                >
                <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                <input type="text" placeholder="Edit description here" value={todoDescription}
                    onChange={(e) => {
                        setTodoDescription(e.target.value);
                        updateMyPresence({ isTyping: true });
                    }}
                    onBlur={() => updateMyPresence({ isTyping: false })}
                />
                <Button 
                    onClick={()=>{
                        modifyTodoProperty(task_id, 'description', todoDescription)
                        setTodoDescription("");
                    }}
                    variant="contained">
                    Update
                </Button>
                <Typography>
                    {description}
                </Typography>
                </CardContent>
            </Collapse>
            <CardActions sx={{ justifyContent: "space-between", p:0 }} disableSpacing>
                <IconButton>
                    <DeleteIcon />
                </IconButton>
                <Button color='error' variant="contained" 
                    onClick={()=>{
                        deleteTodo(task_id)
                    }}
                >Delete this Todo</Button>
            </CardActions>
        </Card>
    )
}

export default TodoCard