import React, { useState, useEffect, createContext, useContext } from 'react';
import Header from '../../Components/Header';
import Sidebar from '../../Components/Sidebar';
import MainContent from '../../Components/MainContent';
import '../../Assets/styles/Layout.css';
import { Toaster, toast } from 'react-hot-toast';

export const MenuContext = createContext();

export function ContextApi() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('ContextApi must be used within a MenuContext.Provider')
  }
  return context
}
const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [FormID, setFormID] = useState(1000)
  const [UserPermissions,setUserPermissions]=useState(
    {isAdd:false,
      isEdit: false,
      isView: false,
      isDelete: false,
      isNotification: false })
  // const [UnitId,setUnitId] = useState('')
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  useEffect(() => {
    if (alert.show) {
      if (alert.type === 'error') {
        toast.error(alert.message);
      } else if (alert.type === 'success') {
        toast.success(alert.message);
      } else {
        toast(alert.message); // Default toast
      }
    }
  }, [alert]);
  return (
    <MenuContext.Provider value={{
      selectedMenu,
      setSelectedMenu,
      FormID,
      setFormID,
      alert: (val) => setAlert(val),
      // setUnitId,
      // UnitId,
      setUserPermissions,
      UserPermissions
    }}
    >

      <div className="app-container">
        <Header />
        <div className="body-container">
          <Sidebar />
          <MainContent />
        </div>
      </div>
      <Toaster
        position="top-center" 
        toastOptions={{
          style: {
            maxWidth: '500px',  
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word', 
            fontSize: '14px', 
          },
          error: {
            style: {
              border: '1px solid red',
              padding: '6px'
            }
          }
        }}
      />

    </MenuContext.Provider>
  );
};

export default Dashboard;
