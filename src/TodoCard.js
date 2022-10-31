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

function AddDescription(props) {
    const [description, setDescription] = useState("");
    const [myPresence, updateMyPresence] = useMyPresence();
    const addDescription = useMutation(({ storage }, description) => {
      const todo = storage.get("todos").get(props.index)
      todo.description = description
      storage.get("todos").set(props.index, todo)
    }, []);
    return (
        <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => {
                setDescription(e.target.value);
                updateMyPresence({ isTyping: true });
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                updateMyPresence({ isTyping: false });
                addDescription(description)
                setDescription("");
                }
            }}
            onBlur={() => updateMyPresence({ isTyping: false })}
            />
    )
}

const TodoCard = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    const [ddl, setDdl] = React.useState(dayjs(Date.now()));
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleDdlChange = (newValue) => {
        setDdl(newValue);
    };
    const {text, description, type, deadline, groupchat} = props.todo;
    const index = props.index;
    return (
        <Card sx={{ maxWidth: 345, bgcolor: "#caf0f8", m:1, p:1 }}>
            <CardContent>
                <AddDescription index={index} />
                <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }} disableSpacing>
                <IconButton>
                <AccessTimeIcon />
                <Typography>Deadline</Typography>
                </IconButton>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    // label="Set Deadline"
                    value={ddl}
                    onChange={handleDdlChange}
                    renderInput={(params) => <TextField {...params} />}
                />
                </LocalizationProvider>
                {/* <Typography>Oct 5, 22:00, 2022</Typography> */}
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