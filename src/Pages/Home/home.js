import React, { useEffect, useState } from 'react'
import { MdOutlineInventory } from "react-icons/md";
import HomeDashboard from './homeDashboard';
import { decode as base64_decode} from "base-64";
import '../../Assets/styles/homepage.css'
import PlotChart from '../Dashboard/PlotChart'
import DashboardPlotCards from '../Dashboard/DashboardCards'
import RightPanel from '../Dashboard/RightPanel';
import { config } from '../../Components/CustomComponents/config';
import socket from '../../Socket';
import Dashboard from '../Dashboard/dashboard';

export default function Home(props) {
    const [ActiveTab, setActiveTab] = useState('Dashboard');
    const username= base64_decode(localStorage.getItem('username'))
    const [DashBoard,setDashBoard] = useState([])
    const [FollowUps,setFollowUps] = useState([])
    const [CompletedFollowUps,setCompletedFollowUps] = useState([])
    
    useEffect(()=>{
        DashBoardStats()
        getPendingFollowUps()
        getCompletedFollowUps()
    },[])
    const tabMenu = [
        { id: 1, tabMenu: "Dashboard" },
        { id: 2, tabMenu: "Getting Started" },
        { id: 3, tabMenu: "Announcements" },
        { id: 4, tabMenu: "Recent Updates" },
    ];
      const DashBoardStats = async () => {
        try {
          let url = config.Api + "DashBoardStats";
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
    
          if (!response.ok) {
            throw new Error('Failed to get DashBoardStats');
          }
          const result = await response.json();
          setDashBoard(result)
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
  const getPendingFollowUps = async () => {
    try {
      let url = config.Api + "getPendingFollowUps";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({employeeId: localStorage.getItem('EmployeeID')}),
      });

      if (!response.ok) {
        throw new Error('Failed to get FollowUps');
      }
      const result = await response.json();
      setFollowUps(result.data)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
    const getCompletedFollowUps = async () => {
    try {
      let url = config.Api + "getCompletedFollowUps";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({employeeId: localStorage.getItem('EmployeeID')}),
      });

      if (!response.ok) {
        throw new Error('Failed to get FollowUps');
      }
      const result = await response.json();
      setCompletedFollowUps(result.data)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
    const renderActiveComponent = () => {
        switch (ActiveTab) {
            case "Dashboard":
                return <HomeDashboard />;
            case "Getting Started":
                return 'Getting Started';
            case "Announcements":
                return 'Announcements';
            case "Recent Updates":
                return 'Recent Updates';
            default:
                return <div>Select a tab</div>;
        }
    };
    return (
        <div className='HomemainDiv'>
          <div style={{width:'100%'}}>
            <div style={{display:'flex'}}>
            <div style={{width:'75%'}}>
{Object.entries(DashBoard).length > 0 &&  <DashboardPlotCards
 DashBoard={DashBoard}
  setSelectedMenu={props.setSelectedMenu}
  setFormID={props.setFormID}
/>}
            </div>
            <div style={{width:'25%'}}>
<RightPanel DashBoard={DashBoard} FollowUps={FollowUps} CompletedFollowUps={CompletedFollowUps}/>
            </div>
            </div>
            <div style={{marginTop:'30px',width:'100%'}}>
              <PlotChart DashBoard={DashBoard}/>
              </div></div>
        </div>
    )
}
