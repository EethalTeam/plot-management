import React,{useContext, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem, Typography, Stack, Box, IconButton } from '@mui/material';
import '../Assets/styles/Header.css';
import Logoimg from '../Assets/Images/Plot-management-Logo.png'
import profile from '../Assets/Images/profile.jpg';
import { logout } from '../Pages/login/auth';
import { useNavigate } from "react-router-dom";
import { MenuContext } from '../Pages/Dashboard/dashboard'
import NotificationIcon from '../Notification';
import { IoMdNotificationsOutline } from "react-icons/io";
import { decode as base64_decode, encode as base64_encode} from "base-64"
import CloseIcon from '@mui/icons-material/Close';
import { TbReload } from "react-icons/tb";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
    const { selectedMenu, FormID, ...context } = useContext(MenuContext);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
const ProfileDialog = ({ open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
     <Box
                   sx={{
                     position: 'sticky',
                     top: 0,
                     zIndex: 2,
                     bgcolor: 'white',
                     borderBottom: '1px solid #eee',
                     p: 1,
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     backgroundColor:'#eae7e7'
                   }}
                 >
                   <Typography variant="h6"><b>Profile</b></Typography>
                   <IconButton onClick={onClose}>
                     <CloseIcon />
                   </IconButton>
                 </Box>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography><b>Employee Code:</b> {base64_decode(localStorage.getItem('EmployeeCode'))}</Typography>
          <Typography><b>Name:</b> {localStorage.getItem('EmployeeName')}</Typography>
          <Typography><b>Department:</b> {localStorage.getItem('departmentName')}</Typography>
          <Typography><b>Role:</b> {base64_decode(localStorage.getItem('role'))}</Typography>
        </Stack>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions> */}
    </Dialog>
  );
};

  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  return (
    <header className="header">
      <ProfileDialog 
      open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
      <div className="logo-container">
        <img src={Logoimg} alt="Logo" className="logo-image" />
        {/* <span className='logotxt'>Inventory</span> */}
         {/* <div className='locationDiv'> */}
        <span style={{paddingTop:'20px',color:'black'}}><b>{selectedMenu}</b></span>
      {/* </div> */}
      </div>
      {/* <div style={{color:'black'}}>
        <b>{localStorage.getItem('unitName')}</b>
      </div> */}
      <div style={{display:'flex'}}>
        <div style={{color:'black',display:'flex',alignItems:'center'}}>
          <TbReload style={{width:'50px',height:'20px',color:'blue'}} onClick={()=>{
            window.location.reload()
          }}/>
       <b> Welcome {localStorage.getItem('EmployeeName')} !</b>
       <NotificationIcon unitId={localStorage.getItem('unitId')} style={{width:'30px',height:'20px',color:'red'}}/>
      </div>
      <div className='ProfileDropdown' onClick={handleClick}>
      <img src={profile} alt="User" className="ProfileImgSty" /></div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={()=>setOpenProfile(true)}>Profile</MenuItem>
        <MenuItem onClick={()=>{
          window.location.reload()
        }}>Refresh</MenuItem>
        <MenuItem onClick={() => {
                    handleClose(); logout();
                    navigate("/login");
                    localStorage.clear();
                  }}>Logout</MenuItem>
      </Menu>
    </header>
  );
};

export default Header;
