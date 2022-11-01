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
    const {text, description, type, deadline, person, status, groupchat} = props.todo;
    const index = props.index;
    const [expanded, setExpanded] = useState(false);
    const [ddl, setDdl] = useState(dayjs(deadline));
    const [todoText, setTodoText] = useState("");
    const [todoDescription, setTodoDescription] = useState("");
    const [todoType, setTodoType] = useState(type);
    const [todoPerson, setTodoPerson] = useState(person);
    const [todoStatus, setTodoStatus] = useState(status);
    const [myPresence, updateMyPresence] = useMyPresence();
    const modifyTodoText = useMutation(({storage}, idx, draft) => {
        let todo = storage.get("todos").get(idx)
        todo.text = draft
        storage.get("todos").set(idx, todo)
    }, []);

    const modifyDdl = useMutation(({storage}, idx, draft) => {
        console.log("use mututation executed")
        let todo = storage.get("todos").get(idx)
        todo.deadline = draft
        storage.get("todos").set(idx, todo)
        setDdl(draft)
    }, [])

    const modifyTodoDescription = useMutation(({storage}, idx, draft) => {
        let todo = storage.get("todos").get(idx)
        todo.description = draft
        storage.get("todos").set(idx, todo)
        setTodoDescription("")
    }, [])

    const modifyTodoType = useMutation(({storage}, idx, draft) => {
        let todo = storage.get("todos").get(idx)
        todo.type = draft
        storage.get("todos").set(idx, todo)
        setTodoType(draft)
    }, [])

    const modifyTodoPerson = useMutation(({storage}, idx, draft) => {
        let todo = storage.get("todos").get(idx)
        todo.person = draft
        storage.get("todos").set(idx, todo)
        setTodoPerson(draft)
    }, [])

    const modifyTodoStatus = useMutation(({storage}, idx, draft) => {
        let todo = storage.get("todos").get(idx)
        todo.status = draft
        storage.get("todos").set(idx, todo)
        setTodoStatus(draft)
    }, [])

    const deleteTodo = useMutation(({storage}, idx) => {
        storage.get("todos").delete(idx);
    }, [])

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    
    return (
        <Card sx={{ maxWidth: 345, bgcolor: "#caf0f8", m:1, p:1 }}>
            <CardContent>
                <input type="text" placeholder="Edit Todo title here" value={todoText}
                    onChange={(e) => {
                        setTodoText(e.target.value);
                        updateMyPresence({ isTyping: true });
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            updateMyPresence({ isTyping: false });
                            modifyTodoText(index, todoText)
                            setTodoText("");
                        }}}
                    onBlur={() => updateMyPresence({ isTyping: false })}
                />
                <Typography variant="h5" color="#1565c0">
                    {text}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }} disableSpacing>
                <IconButton>
                <AccessTimeIcon />
                <Typography>Deadline</Typography>
                </IconButton>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        value={ddl}
                        onChange={(newValue) => {
                            modifyDdl(index, newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </CardActions>
            <CardActions sx={{ justifyContent: "space-between" }} disableSpacing>
                <IconButton>
                <CategoryIcon />
                <Typography>Task Type</Typography>
                </IconButton>
                <Select id="todoType" value={todoType} onChange={(event) => {modifyTodoType(index, event.target.value)}}>
                    <MenuItem value="Features">Features</MenuItem>
                    <MenuItem value="Testing">Testing</MenuItem>
                    <MenuItem value="Styling">Styling</MenuItem>
                    <MenuItem value="Devops">Devops</MenuItem>
                    <MenuItem value="Bug fix">Bug fix</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                </Select>
            </CardActions>
            <CardActions sx={{ justifyContent: "space-between" }} disableSpacing>
                <IconButton>
                <PersonIcon />
                <Typography>Assigned To</Typography>
                </IconButton>
                <Select id="todoPerson" value={todoPerson} onChange={(event) => {modifyTodoPerson(index, event.target.value)}}>
                    <MenuItem value="Nobody">Nobody</MenuItem>
                    <MenuItem value="Fengyi Wang">Fengyi Wang</MenuItem>
                    <MenuItem value="Jincheng Li">Jincheng Li</MenuItem>
                    <MenuItem value="Sibo Min">Sibo Min</MenuItem>
                    <MenuItem value="Xiaomu Dong">Xiaomu Dong</MenuItem>
                    <MenuItem value="Zihan Wang">Zihan Wang</MenuItem>
                </Select>
            </CardActions>
            <CardActions sx={{ justifyContent: "space-between" }} disableSpacing>
                <IconButton>
                <DonutLargeIcon />
                <Typography>Progress</Typography>
                </IconButton>
                <Select id="todoStatus" value={todoStatus} onChange={(event) => {modifyTodoStatus(index, event.target.value)}}>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Testing">Testing</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Canceled">Canceled</MenuItem>
                </Select>
            </CardActions>
            
            <CardActions disableSpacing>
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
                    modifyTodoDescription(index, todoDescription)
                }}
                variant="contained">Update</Button>
                <Typography>
                    {description}
                </Typography>
                </CardContent>
            </Collapse>
            <CardActions sx={{ justifyContent: "space-between" }} disableSpacing>
                <IconButton>
                    <DeleteIcon />
                </IconButton>
                <Button color='error' variant="contained" 
                    onClick={()=>{
                        deleteTodo(index)
                    }}
                >Delete this Todo</Button>
            </CardActions>
        </Card>
    )
}

export default TodoCard