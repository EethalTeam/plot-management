import React, { useEffect, useState } from "react";
import socket from "./Socket";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IoMdNotificationsOutline } from "react-icons/io";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {config} from './Components/CustomComponents/config'

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [Notify,setNotify] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const unitId = localStorage.getItem('unitId');
useEffect(()=>{
// getNotifications()
},[])
  useEffect(() => {
    if (!unitId) return;

    // Join the room
    socket.emit("joinRoom", { unitId });

    const handler = (msg) => {
      const text = typeof msg === "string" ? msg : msg.message;
      setNotifications((prev) => [...prev, text]);
      setUnreadCount((prev) => prev + 1);
      getNotifications()
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [unitId]);
const getNotifications = async()=>{
     try {
      let url = config.Api + "Notifications/getNotifications";
       const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({unitId: unitId}),
        });
        const data = await response.json();
        setNotify(data.data);
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
      }
}
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <IoMdNotificationsOutline style={{color:'red'}}/>
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div style={{ padding: "16px", maxWidth: "500px" }}>
          {Notify.length === 0 && (
            <Typography variant="body2">No new notifications.</Typography>
          )}
          {(Notify && Notify.length && Notify.length > 0 )? Notify.slice(0,5).map((msg, idx) => (
            <Typography key={idx} variant="body2" style={{ marginBottom: 8 }}>
              {msg.message}
            </Typography>
          )):''}
        </div>
      </Popover>
    </>
  );
};

export default NotificationIcon;
