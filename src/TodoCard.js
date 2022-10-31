import React from 'react'
import { useState, Suspense } from "react";
import { RoomProvider, useOthers, useUpdateMyPresence, useMyPresence, useStorage, useMutation } from "./liveblocks.config";
import { LiveList } from "@liveblocks/client";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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
    const {text, description, type, deadline, groupchat} = props.todo;
    const index = props.index;
    const [expanded, setExpanded] = useState(false);
    const [ddl, setDdl] = useState(dayjs(deadline));
    const [todoDescription, setTodoDescription] = useState("");
    const [myPresence, updateMyPresence] = useMyPresence();
    const modifyTodo = useMutation(({storage}, idx, draft) => {
        let todo = storage.get("todos").get(idx)
        todo.description = draft
        storage.get("todos").set(idx, todo)
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleDdlChange = (newValue) => {
        setDdl(newValue);
    };
    const modifyDdl = useMutation(({storage}, idx, draft) => {
        console.log("use mututation executed")
        let todo = storage.get("todos").get(idx)
        todo.deadline = draft
        storage.get("todos").set(idx, todo)
        setDdl(draft)
    }, [])
    
    return (
        <Card sx={{ maxWidth: 345, bgcolor: "#caf0f8", m:1, p:1 }}>
            <CardContent>
                <input type="text" placeholder="Description" value={todoDescription}
                    onChange={(e) => {
                        setTodoDescription(e.target.value);
                        updateMyPresence({ isTyping: true });
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            updateMyPresence({ isTyping: false });
                            modifyTodo(index, todoDescription)
                            setTodoDescription("");
                        }}}
                    onBlur={() => updateMyPresence({ isTyping: false })}
                />
                <Typography variant="h5" color="#1565c0">
                    {description}
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
                <Typography>
                    Pull request: https://github.com/lorem-ipsum123
                </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default TodoCard