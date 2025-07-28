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

export default function Home(props) {
    const [ActiveTab, setActiveTab] = useState('Dashboard');
    const username= base64_decode(localStorage.getItem('username'))
    const [ChildProduct,setChildProduct] = useState([])
    const [ChildCount,setChildCount] = useState(0)
    const [ParentProduct,setParentProduct] = useState([])
    const [ParentCount,setParentCount] = useState(0)
    const [MainParentProduct,setMainParentProduct] = useState([])
    const [MainParentCount,setMainParentCount] = useState(0)
    
    useEffect(()=>{
        // getChildProduct()
        // getParentProduct()
        // getMainParentProduct()
          // socket.emit("joinRoom", { unitId:localStorage.getItem('unitId') });
    },[])
    useEffect(()=>{
        if(ChildProduct.length > 0){
           setChildCount(ChildProduct.reduce((acc,curr)=>{
        return acc+=(curr.totalCPQuantity || 0)
       },0))
        }
        if(ParentProduct.length > 0){
       setParentCount(ParentProduct.reduce((acc,curr)=>{
        return acc+=(curr.totalPPQuantity || 0)
       },0))
        }
        if(MainParentProduct.length > 0){
       setMainParentCount(MainParentProduct.reduce((acc,curr)=>{
        return acc+=(curr.totalMPQuantity || 0)
       },0))
        }
    },[ChildProduct,ParentProduct,MainParentProduct])
    const tabMenu = [
        { id: 1, tabMenu: "Dashboard" },
        { id: 2, tabMenu: "Getting Started" },
        { id: 3, tabMenu: "Announcements" },
        { id: 4, tabMenu: "Recent Updates" },
    ];
      const getChildProduct = async () => {
        try {
          let url = config.Api + "ChildProduct/getAllChildProducts";
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({unitId: localStorage.getItem('unitId')}),
          });
    
          if (!response.ok) {
            throw new Error('Failed to get ChildProduct');
          }
          const result = await response.json();
          setChildProduct(result)
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
  const getParentProduct = async () => {
    try {
      let url = config.Api + "ParentProduct/getAllParentProducts";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unitId: localStorage.getItem('unitId')}),
      });

      if (!response.ok) {
        throw new Error('Failed to get ParentProduct');
      }
      const result = await response.json();
      setParentProduct(result)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
    const getMainParentProduct = async () => {
      try {
        let url = config.Api + "MainParentProduct/getAllMainParentProducts";
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({unitId: localStorage.getItem('unitId')}),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get MainParentProduct');
        }
        const result = await response.json();
        setMainParentProduct(result)
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
            <div style={{width:'75%'}}>
 <DashboardPlotCards
  childPlot={ChildCount}
  parentPlot={ParentCount}
  mainParentPlot={MainParentCount}
  setSelectedMenu={props.setSelectedMenu}
  setFormID={props.setFormID}
/>
<div style={{marginTop:'65px'}}>
              <PlotChart />
              </div>
            </div>
            <div style={{width:'25%'}}>
<RightPanel />
            </div>
        </div>
    )
}
