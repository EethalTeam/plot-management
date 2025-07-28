import React, { useState ,useContext, useEffect} from "react";
import { sidebarMenu, updatedMenu , filterMenuByRoleAndUnit} from "./data/sidebarMenu";
import "../Assets/styles/Sidebar.css";
import { MenuContext } from "../Pages/Dashboard/dashboard";
import { IoAddCircle } from "react-icons/io5";
import { PiArrowBendDownRightBold } from "react-icons/pi";
import { FaCircle } from "react-icons/fa";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { decode as base64_decode} from "base-64";
import { config } from '../Components/CustomComponents/config';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const UserRole=base64_decode(localStorage.getItem('role'))
  const [SideBarMenu,setSideBarMenu] = useState([])
  const { selectedMenu, setSelectedMenu, setFormID ,setUserPermissions} = useContext(MenuContext);
  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };
  useEffect(()=>{
    getMenuByEmployee()
  },[])
  const getMenuByEmployee = async () => {
        try {
          const employee=localStorage.getItem('EmployeeID')
          let url = config.Api + "UserRights/getUserRightsByEmployeeId";
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({employeeId: employee}),
          });
    
          if (!response.ok) {
            throw new Error('Failed to get OrderCreation');
          }
          const result = await response.json();
          setSideBarMenu(result.data)
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      
  }
  const visibleMenu = filterMenuByRoleAndUnit(updatedMenu, UserRole);
  const handleMenuSelect = (parent, child = "",FormID,UnitId,menu) => {
    const path = child ? `${parent} > ${child}` : parent;
    const UserPermissions={
      isAdd: menu.isAdd,
      isEdit: menu.isEdit,
      isView: menu.isView,
      isDelete: menu.isDelete,
      isNotification: menu.isNotification 
    }
    setSelectedMenu(path);
setFormID(FormID)
setUserPermissions(UserPermissions)
  };
  return (
    <aside className="sidebar">
      <ul className='sidebar-lists'>
        {sidebarMenu.length > 0 ? sidebarMenu.map((menu) => (
          <li
            key={menu.title}
            // className={`menu-item ${selectedMenu === menu.title && menu.children.length === 0 ? "parent-active-with-bg" : "none"
            //   }`}
          >
            <div
              className="menu-title"
              onClick={() => {
                if (menu.children.length > 0) {
                  toggleMenu(menu.title);
                }
                if(menu.children.length === 0){
                handleMenuSelect(menu.title,'',menu.formId,'',menu);
                }
              }}
            >
              <div className="menu-title-icon">
                {/* <span className="menu-icon">{menu.icon}</span> */}
                <span>{menu.title}</span>
              </div>
              {(menu.children && menu.children.length > 0) && (
                <span className="menu-toggle">
                  {openMenus[menu.title] ? <FaCaretDown/>: <FaCaretRight/>}
                </span>
              )}
            </div>
            {menu.children && openMenus[menu.title] && (
              <ul className="submenu">
                {menu.children.map((sub) => {
                  const isActive = selectedMenu === `${menu.title} > ${sub.title}`;
                  return (
                    <li
                      key={sub.title}
                      className={`submenu-item ${isActive ? "child-active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuSelect(menu.title, sub.title,sub.formId,sub.UnitId,sub);
                      }}
                    >
                      {/* <span className="submenu-icon">{sub.icon}</span> */}
                      <div className="submenu-head">
                        <span className="submenu-add-icon" style={{width:'15%',display:'flex',alignItems:'center',color:'#9B9B9B'}}>
                        <FaCircle className={`${isActive ? 'test':null}`}/>
                      </span>
                      <span>{sub.title}</span>
                      {/* <span className="submenu-add-icon">
                        <IoAddCircle className={`${sub.FormID? 'test':null}`}/>
                      </span> */}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        )) : ''}
      </ul>
    </aside>
  );
};

export default Sidebar;
