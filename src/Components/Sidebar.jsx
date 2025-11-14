import React, { useState, useContext, useEffect } from "react";
import {
  sidebarMenu,
  updatedMenu,
  filterMenuByRoleAndUnit,
} from "./data/sidebarMenu";
import "../Assets/styles/Sidebar.css";
import { MenuContext } from "../Pages/Dashboard/dashboard";
import { FaCircle, FaCaretDown, FaCaretRight, FaCaretLeft } from "react-icons/fa";
import { decode as base64_decode } from "base-64";
import { config } from "../Components/CustomComponents/config";
import { LuLandPlot } from "react-icons/lu";
import { RiAdminFill } from "react-icons/ri";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [SideBarMenu, setSideBarMenu] = useState([]);
  const { selectedMenu, setSelectedMenu, setFormID, setUserPermissions } =
    useContext(MenuContext);

  useEffect(() => {
    getMenuByEmployee();
  }, []);

  const getMenuByEmployee = async () => {
    try {
      const employee = localStorage.getItem("EmployeeID");
      const url = config.Api + "UserRights/getUserRightsByEmployeeId";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId: employee }),
      });

      if (!response.ok) {
        throw new Error("Failed to get menu");
      }
      const result = await response.json();
      setSideBarMenu(result.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleMenuSelect = (parent, child = "", FormID, UnitId, menu) => {
    const path = child ? `${parent} > ${child}` : parent;
    const UserPermissions = {
      isAdd: menu.isAdd,
      isEdit: menu.isEdit,
      isView: menu.isView,
      isDelete: menu.isDelete,
      isNotification: menu.isNotification,
    };
    setSelectedMenu(path);
    setFormID(FormID);
    setUserPermissions(UserPermissions);
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? <FaCaretLeft /> : <FaCaretRight />}
      </button>

      <ul className="sidebar-lists">
        {SideBarMenu.length > 0 &&
          SideBarMenu.map((menu) => (
            <li key={menu.title}>
              <div
                className="menu-title"
                onClick={() => {
                  if (menu.children.length > 0) {
                    toggleMenu(menu.title);
                  }
                  if (menu.children.length === 0) {
                    handleMenuSelect(menu.title, "", menu.formId, "", menu);
                  }
                }}
              >
                <div className="menu-title-icon">
                  {/* Add icon if needed */}
                  <span className="menu-icon">{menu.title === 'Plots' ? <LuLandPlot/> : 
                  menu.title === 'Dashboard' ? <MdDashboard/> : 
                  menu.title === 'Visitor' ? <FaUsers/> : 
                  menu.title === 'Master forms' ? <MdOutlineFormatListBulleted/> :
                  menu.title === 'Admin Panel' ? <RiAdminFill/> :
                  <FaCircle />}</span>
                  {isSidebarOpen && <span>{menu.title}</span>}
                </div>
                {menu.children && menu.children.length > 0 && isSidebarOpen && (
                  <span className="menu-toggle">
                    {openMenus[menu.title] ? <FaCaretDown /> : <FaCaretRight />}
                  </span>
                )}
              </div>

              {menu.children && openMenus[menu.title] && isSidebarOpen && (
                <ul className="submenu">
                  {menu.children.map((sub) => {
                    const isActive =
                      selectedMenu === `${menu.title} > ${sub.title}`;
                    return (
                      <li
                        key={sub.title}
                        className={`submenu-item ${
                          isActive ? "child-active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuSelect(
                            menu.title,
                            sub.title,
                            sub.formId,
                            sub.UnitId,
                            sub
                          );
                        }}
                      >
                        <div className="submenu-head">
                          <span
                            className="submenu-add-icon"
                            style={{
                              width: "15%",
                              display: "flex",
                              alignItems: "center",
                              color: "#9B9B9B",
                            }}
                          >
                            <FaCircle
                              className={`${isActive ? "test" : null}`}
                            />
                          </span>
                          <span>{sub.title}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
