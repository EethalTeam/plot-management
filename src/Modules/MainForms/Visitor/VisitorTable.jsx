import React, { useState, useReducer, useCallback, useEffect } from 'react'
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Loading from '../../../Components/CustomComponents/Loading';
import Reducer from '../../../Components/Reducer/commonReducer';
import TextFieldCustom from '../../../Components/CustomComponents/textField';
import TextAreaCustom from '../../../Components/CustomComponents/TextArea';
import { FaSearch } from "react-icons/fa";
// import ClearIcon from '@material-ui/icons/Clear';
import CustomDatePicker from '../../../Components/CustomComponents/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { config } from '../../../Components/CustomComponents/config';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import ToggleSwitch from '../../../Components/CustomComponents/toggleSwitch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExportTableToExcel from "../../../Components/CustomComponents/ExportTableToExcel";
import GridContainer from '../../../Components/CustomComponents/GridContainer';
import GridItem from '../../../Components/CustomComponents/GridItem';
import DataTable from 'react-data-table-component';
import { FaEye, FaEdit, FaTrash, FaCircle } from 'react-icons/fa';
import DropDown from '../../../Components/CustomComponents/DataList'
import DropDownMulti from '../../../Components/CustomComponents/DropDownMulti'
import '../../../Assets/app.css'
import { TbRefresh } from "react-icons/tb";
import StyledTooltip from '../../../Components/CustomComponents/Tooltip'
import ViewDataModal from '../../../Components/CustomComponents/ViewData';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const initialState = {
    _id: '',
   visitorCode:'',
   visitorName:'',
   visitorEmail:'',
   visitorMobile:'',
   visitorWhatsApp:'',
   visitorPhone:'',
   visitorAddress:'',
   isActive:'',
   feedback:'',
   description:'',
   employeeId:'',
   employeeName:'',
   cityId:'',
   CityName:'',
   StateID:'',
   StateName:'',
   unitId:'',
   UnitName:'',
   plotId:[],
   plotNumber:'',
   statusId:'',
   statusName:'',
   followUpId:'',
   followUpDate:'',
   followedUpById:'',
   followedUpByName:'',
   followUpStatus:'',
   followUpDescription:'',
   notes:'',
   remarks:''
 }
export default function VisitorTable(props) {
  const headers = ["Visitor Code","Visitor Name",'Active']
  const TableVisibleItem = ["VisitorCode","VisitorName",'isActive']
  const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
const columns = [
  // {
  //   name: 'Visitor Code',
  //   selector: row => row.visitorCode,
  //   sortable: true,
  //   width: '20%',
  // },
  {
    name: 'Visitor Name',
    selector: row => row.visitorName,
    sortable: true,
    width: '20%',
  },
    {
    name: 'Visitor Email',
    selector: row => row.visitorEmail,
    sortable: true,
    width: '20%',
  },
    {
    name: 'Visitor Mobile',
    selector: row => row.visitorMobile,
    sortable: true,
    width: '20%',
  },
  // {
  //   name: 'Active',
  //   selector: row => row.isActive,
  //   sortable: true,
  //   cell: row => (
  //     <FaCircle
  //       color={row.isActive ? 'green' : 'red'}
  //       title={row.isActive ? 'Active' : 'Inactive'}
  //       size={12}
  //     />
  //   ),
  //   center: true,
  // },
  {
    name: 'Actions',
    cell: row => (
      <div style={{ display: 'flex', gap: '20px' }}>
        {props.UserPermissions.isView &&<FaEye
          onClick={() => handleView(row)}
          style={{ cursor: 'pointer', color: '#007bff' }}
          title="View"
        />}
        {/* {props.UserPermissions.isEdit && */}
        <FaEdit
          onClick={() => editTable(row)}
          style={{ cursor: 'pointer', color: '#ffc107' }}
          title="Edit"
        />
        {/* } */}
        {props.UserPermissions.isDelete &&<FaTrash
          onClick={() => DeleteAlert(row)}
          style={{ cursor: 'pointer', color: '#dc3545' }}
          title="Delete"
        />}
        {/* {(!props.UserPermissions.isView && !props.UserPermissions.isEdit && !props.UserPermissions.isDelete) && 
        <p>-</p>
        } */}
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: '20%',
  },
];
const FollowUpColumns = [
  // {
  //   name: 'Visitor Code',
  //   selector: row => row.visitorCode,
  //   sortable: true,
  //   width: '20%',
  // },
  {
    name: 'Follow up Date',
    selector: row => row.followUpDate ? row.followUpDate.split('T')[0].split('-').reverse().join('-'):'',
    sortable: true,
    width: '20%',
  },
    {
    name: 'Status',
    // selector: row => row.followUpStatus,
    cell: row => (
      <span style={{backgroundColor:row.followUpStatus ==='Pending' ? 'red' : '#2ec82e',padding:'10px',borderRadius:'5px'}}>{row.followUpStatus}</span>
    ),
    sortable: true,
    width: '15%',
  },
    {
    name: 'Notes',
    selector: row => row.notes,
    sortable: true,
    width: '25%',
  },
    {
    name: 'Remarks',
    selector: row => row.remarks,
    sortable: true,
    width: '20%',
  },
  // {
  //   name: 'Active',
  //   selector: row => row.isActive,
  //   sortable: true,
  //   cell: row => (
  //     <FaCircle
  //       color={row.isActive ? 'green' : 'red'}
  //       title={row.isActive ? 'Active' : 'Inactive'}
  //       size={12}
  //     />
  //   ),
  //   center: true,
  // },
  {
    name: 'Actions',
    cell: row => (
      <div style={{ display: 'flex', gap: '20px' }}>
        {props.UserPermissions.isView &&<FaEye
          onClick={() => handleView(row)}
          style={{ cursor: 'pointer', color: '#007bff' }}
          title="View"
        />}
        {/* {props.UserPermissions.isEdit && */}
        <FaEdit
          onClick={() => EditFollowup(row)}
          style={{ cursor: 'pointer', color: '#ffc107' }}
          title="Edit"
        />
        {/* } */}
        {props.UserPermissions.isDelete &&<FaTrash
          onClick={() => DeleteAlert(row)}
          style={{ cursor: 'pointer', color: '#dc3545' }}
          title="Delete"
        />}
        {(!props.UserPermissions.isView && !props.UserPermissions.isEdit && !props.UserPermissions.isDelete) && 
        <p>-</p>
        }
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: '20%',
  },
];
const PlotColumns= [
    {
    name: 'Unit',
    selector: row => row.plotId ? row.plotId.unitId.UnitName : '',
    sortable: true,
    width: '30%',
  },
  {
    name: 'Plot number',
    selector: row => row.plotId ? row.plotId.plotNumber : '',
    sortable: true,
    width: '20%',
  },
    {
    name: 'Status',
    // selector: row => row.followUpStatus,
    cell: row => (
      <span style={{backgroundColor:row.statusId ? row.statusId.colorCode : 'white',padding:'10px',borderRadius:'5px'}}>{row.statusId ? row.statusId.statusName : ''}</span>
    ),
    sortable: true,
    width: '30%',
  },
  // {
  //   name: 'Active',
  //   selector: row => row.isActive,
  //   sortable: true,
  //   cell: row => (
  //     <FaCircle
  //       color={row.isActive ? 'green' : 'red'}
  //       title={row.isActive ? 'Active' : 'Inactive'}
  //       size={12}
  //     />
  //   ),
  //   center: true,
  // },
  {
    name: 'Actions',
    cell: row => (
      <div style={{ display: 'flex', gap: '20px' }}>
        {props.UserPermissions.isView &&<FaEye
          onClick={() => handleView(row)}
          style={{ cursor: 'pointer', color: '#007bff' }}
          title="View"
        />}
        {/* {props.UserPermissions.isEdit && */}
        <FaEdit
          onClick={() => EditPlot(row)}
          style={{ cursor: 'pointer', color: '#ffc107' }}
          title="Edit"
        />
        {/* } */}
        {props.UserPermissions.isDelete &&<FaTrash
          onClick={() => DeleteAlert(row)}
          style={{ cursor: 'pointer', color: '#dc3545' }}
          title="Delete"
        />}
        {(!props.UserPermissions.isView && !props.UserPermissions.isEdit && !props.UserPermissions.isDelete) && 
        <p>-</p>
        }
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: '20%',
  },
];
  const [showentry, setShowEntry] = useState('')
  const [loading, setLoading] = useState(false);
  const [hideAdd, setHideAdd] = useState(true);
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [Visitor, setVisitor] = useState([])
  const [PlotDetails,setPlotDetails] = useState([])
  const [FollowUpDetails,setFollowUpDetails] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [followUpEdit,setfollowUpEdit] = useState(false)
  const [PlotEdit,setPlotEdit] = useState(false)
  const [AddFollow,setAddFollow] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue,setFilterValue] = useState('')
  const [Data, SetData] = useState([])
  const [OrderTab,setOrderTab] = useState('Follow Up')
  const [Status,setStatus] = useState([{StatusIDPK:1,StatusName:"Pending"},
    {StatusIDPK:2,StatusName:"Completed"}
  ])
  const [active, setActive] = useState(true);

  useEffect(() => {
    getVisitor()
  }, [])

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleSearchChange = (
    debounce((value) => {
      setSearchTerm(value);
      if (Visitor.length > 0) {
        applySearchFilter(value);
      }
    }, 300)
  );

  const applySearchFilter = (search) => {
    if (Visitor.length === 0) {
      return;
    }

    let data = [...Visitor];
    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    setFilteredData(filtered);
  };
  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        fontSize: '16px',
      },
    },
  };
  const clear = () => {
    setIsEdit(false);
    setActive(true);
    dispatch({ type: 'text', name: '_id', value: "" });
        dispatch({ type: 'text', name: "visitorCode", value:'' });
       dispatch({ type: 'text', name: "visitorName", value:'' });
       dispatch({ type: 'text', name: "visitorEmail", value:'' });
       dispatch({ type: 'text', name: "visitorMobile", value:'' });
       dispatch({ type: 'text', name: "visitorWhatsApp", value:'' });
       dispatch({ type: 'text', name: "visitorPhone", value:'' });
       dispatch({ type: 'text', name: "visitorAddress", value:'' });
       dispatch({ type: 'text', name: "feedback", value:'' });
       dispatch({ type: 'text', name: "description", value:'' });
       dispatch({ type: 'text', name: "cityId", value:'' });
        dispatch({ type: 'text', name: "CityName", value: '' });
        dispatch({ type: 'text', name: "StateID", value:'' });
        dispatch({ type: 'text', name: "StateName", value: '' });
        dispatch({ type: 'text', name: "employeeId", value:'' });
        dispatch({ type: 'text', name: "employeeName", value: '' });
         dispatch({ type: 'text', name: "followUpId", value:'' });
    dispatch({ type: 'text', name: "followUpDate", value:'' });
    dispatch({ type: 'text', name: "followedUpById", value:'' });
    dispatch({ type: 'text', name: "followedUpByName", value:'' });
    dispatch({ type: 'text', name: "followUpStatus", value: "Pending" });
    dispatch({ type: 'text', name: "followUpDescription", value:'' });
    dispatch({ type: 'text', name: "notes", value:'' });
    dispatch({ type: 'text', name: "remarks", value:'' });
       setPlotDetails([])
       setFollowUpDetails([])
     }
const cleaerFollowUp=()=>{
  dispatch({ type: 'text', name: "followUpId", value:'' });
    dispatch({ type: 'text', name: "followUpDate", value:'' });
    dispatch({ type: 'text', name: "followedUpById", value:'' });
    dispatch({ type: 'text', name: "followedUpByName", value:'' });
    dispatch({ type: 'text', name: "followUpStatus", value: "Pending" });
    dispatch({ type: 'text', name: "followUpDescription", value:'' });
    dispatch({ type: 'text', name: "notes", value:'' });
    dispatch({ type: 'text', name: "remarks", value:'' });
}
const clearPlot=()=>{
  dispatch({ type: 'text', name: "plotId", value:'' });
    dispatch({ type: 'text', name: "plotNumber", value:''});
    dispatch({ type: 'text', name: "unitId", value:'' });
    dispatch({ type: 'text', name: "UnitName", value:'' });
    dispatch({ type: 'text', name: "statusId", value:'' });
    dispatch({ type: 'text', name: "statusName", value:''});
}
  const columnsConfig = [
     {label:"Visitor Code", value: "visitorCode" },
      {label:"Visitor Name", value: "visitorName" }
   ,
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
     if (!state.visitorName) {
    props.alert({ type: 'error', message: 'Please enter Visitor Name', show: true });
    return;
  }
  // if (!state.visitorEmail) {
  //   props.alert({ type: 'error', message: 'Please enter Visitor Email', show: true });
  //   return;
  // }
  if (!state.visitorMobile) {
    props.alert({ type: 'error', message: 'Please enter Visitor Mobile number', show: true });
    return;
  }
  // if (!state.visitorWhatsApp) {
  //   props.alert({ type: 'error', message: 'Please enter Visitor Whatsapp number', show: true });
  //   return;
  // }
  if (!state.visitorAddress) {
    props.alert({ type: 'error', message: 'Please enter Visitor Address', show: true });
    return;
  }
         showAlert('Main')
  }
    const ValidateFollowUp = () => {
     if (!state.followUpDate) {
    props.alert({ type: 'error', message: 'Please enter Follow up date', show: true });
    return;
  }
  if (!state.followedUpById) {
    props.alert({ type: 'error', message: 'Please Assign a staff', show: true });
    return;
  }
    if (!state.followUpStatus) {
    props.alert({ type: 'error', message: 'Please select followup status', show: true });
    return;
  }
  if (!state.notes) {
    props.alert({ type: 'error', message: 'Please enter Follow up notes', show: true });
    return;
  }
         showAlert('Follow Up')
  }
      const ValidatePlot = () => {
     if (!state.unitId) {
    props.alert({ type: 'error', message: 'Please select Unit', show: true });
    return;
  }
    if (!state.statusName) {
    props.alert({ type: 'error', message: 'Please select Status', show: true });
    return;
  }
         showAlert(OrderTab)
  }

  const showAlert = (val) => {
    Swal.fire({
      title: 'Are you sure?',
      text: isEdit ? 'Do you really want to Update this data?' : 'Do you really want to save this data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'small-popup',
        title: 'small-title',
        htmlContainer: 'small-text',
        confirmButton: 'small-button',
        cancelButton: 'small-button',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
         val === 'Main' ?  await handleSubmit() : val === 'Follow Up' ? await FollowUpSubmit() : PlotSubmit() ;
          Swal.fire({
            title: 'Success!',
            text: isEdit ? 'Your data has been updated.' : 'Your data has been saved.',
            icon: 'success',
            customClass: {
              popup: 'small-popup',
              title: 'small-title',
              htmlContainer: 'small-text',
              confirmButton: 'small-button',
            },
          });
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: error.message || 'Something went wrong.',
            icon: 'error',
            customClass: {
              popup: 'small-popup',
              title: 'small-title',
              htmlContainer: 'small-text',
              confirmButton: 'small-button',
            },
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

const DeleteAlert = (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'small-popup',
        title: 'small-title',
        htmlContainer: 'small-text',
        confirmButton: 'small-button',
        cancelButton: 'small-button',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await deleteRow(row);
          Swal.fire({
            title: 'Success!',
            text: 'Your data has been deleted.',
            icon: 'success',
            customClass: {
              popup: 'small-popup',
              title: 'small-title',
              htmlContainer: 'small-text',
              confirmButton: 'small-button',
            },
          });
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: error.message || 'Something went wrong.',
            icon: 'error',
            customClass: {
              popup: 'small-popup',
              title: 'small-title',
              htmlContainer: 'small-text',
              confirmButton: 'small-button',
            },
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };
  const handleSubmit = async () => {
    props.alert({ type: '', message: '', show: false });

    const updateData = {
      _id: state._id,       
visitorName:state.visitorName,
visitorEmail:state.visitorEmail,
visitorMobile:state.visitorMobile,
visitorWhatsApp:state.visitorWhatsApp,
visitorPhone:state.visitorPhone,
cityId:state.cityId,
visitorAddress:state.visitorAddress,
feedback:state.feedback,
description:state.description,
employeeId:state.employeeId,
        //  isActive:active
    };
    if(state.followUpDate){
      updateData.followUpDate = state.followUpDate.split('-').reverse().join('-')
    }
    if(state.followedUpById){
      updateData.followedUpById = state.followedUpById
    }
    if(state.followUpStatus){
      updateData.followUpStatus = state.followUpStatus
    }
    if(state.followUpDescription){
      updateData.followUpDescription = state.followUpDescription
    }
    if(state.notes){
      updateData.notes = state.notes
    }
    if(state.remarks){
      updateData.remarks = state.remarks
    }
    const saveData={
visitorName:state.visitorName,
visitorEmail:state.visitorEmail,
visitorMobile:state.visitorMobile,
visitorWhatsApp:state.visitorWhatsApp,
visitorPhone:state.visitorPhone,
cityId:state.cityId,
visitorAddress:state.visitorAddress,
feedback:state.feedback,
description:state.description,
employeeId:state.employeeId,
followUpDate:state.followUpDate ? state.followUpDate.split('-').reverse().join('-') : '',
followedUpById:state.followedUpById,
followUpStatus:state.followUpStatus,
followUpDescription:state.followUpDescription,
notes:state.notes,
remarks:state.remarks
          // isActive:active
    }

    try {
      if (isEdit) {
        await updateVisitor(updateData);
        props.alert({ type: 'success', message: 'Visitor Updated successfully!', show: true });
      } else {
        await createVisitor(saveData);
        props.alert({ type: 'success', message: 'Visitor created successfully!', show: true });
      }
      clear();
      getVisitor();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update Visitor.' : 'Failed to create Visitor.');
    }
  };

  const FollowUpSubmit = async () => {
    props.alert({ type: '', message: '', show: false });

    const saveData = {
      visitorId: state._id,
      followUpDate:state.followUpDate.split('-').reverse().join('-'),
      followedUpById:state.followedUpById,
      followUpStatus:state.followUpStatus,
      followUpDescription:state.followUpDescription,
      notes:state.notes,
      remarks:state.remarks
    };
    const updateData ={
      visitorId: state._id,
      followUpId:state.followUpId,
      followUpDate:state.followUpDate.split('-').reverse().join('-'),
      followedUpById:state.followedUpById,
      followUpStatus:state.followUpStatus,
      followUpDescription:state.followUpDescription,
      notes:state.notes,
      remarks:state.remarks
    }

    try {
     if (followUpEdit) {
        await updateFollowUp(updateData);
        props.alert({ type: 'success', message: 'Follow up Updated successfully!', show: true });
      } else {
        await addFollowUp(saveData);
        props.alert({ type: 'success', message: 'Follow up added successfully!', show: true });
      }
      cleaerFollowUp()
      getVisitorFollowUps();
    } catch (error) {
      throw new Error('Failed to Add Follow up.');
    }
  };
    const PlotSubmit = async () => {
    props.alert({ type: '', message: '', show: false });

    const saveData = {
      visitorId: state._id,
      statusId: state.statusId,
      plotIds:state.plotId,
      unitId:state.unitId
    };
    const updateData ={
      visitorId: state._id,
      statusId: state.statusId,
      plotId:state.plotId,
      unitId:state.unitId
    }

    try {
     if (PlotEdit) {
        await updatePlots(updateData);
        props.alert({ type: 'success', message: 'Plot details Updated successfully!', show: true });
      } else {
        await addPlots(saveData);
        props.alert({ type: 'success', message: 'Plot details added successfully!', show: true });
      }
      clearPlot()
      getVisitorPlots();
    } catch (error) {
      throw new Error('Failed to Add Follow up.');
    }
  };

  const getVisitor = async () => {
    try {
      setLoading(true);
      const employeeId=localStorage.getItem('EmployeeID')
      let url = config.Api + "Visitor/getAllVisitor";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({employeeId:employeeId}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Visitor');
      }
      setLoading(false);
      const result = await response.json();
      setVisitor(result.data)
      setFilteredData(result.data);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

    const getVisitorFollowUps = async () => {
    try {
      setLoading(true);
      let url = config.Api + "Visitor/getVisitorFollowUps";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({visitorId:state._id}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Visitor');
      }
      setLoading(false);
      const result = await response.json();
      setFollowUpDetails(result.followUps)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
      const getVisitorPlots = async () => {
    try {
      setLoading(true);
      let url = config.Api + "Visitor/getVisitorPlots";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({visitorId:state._id}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Visitor');
      }
      setLoading(false);
      const result = await response.json();
      setPlotDetails(result.plots)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const createVisitor = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Visitor/createVisitor";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create Visitor');
      }
      const result = await response.json();
      setHideAdd(!hideAdd)
      setShowEntry(!showentry)
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const updateVisitor = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Visitor/updateVisitor";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to update Visitor');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
    const addFollowUp = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Visitor/addFollowUp";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to add follow up');
      }
      setAddFollow(false)
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
    const updateFollowUp = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Visitor/updateFollowUp";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to add follow up');
      }
      setAddFollow(false)
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

      const addPlots = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Visitor/addPlotToVisitor";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to add follow up');
      }
      setAddFollow(false)
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
      const updatePlots = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Visitor/updateVisitorPlot";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to add follow up');
      }
      setAddFollow(false)
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const storeDispatch = useCallback(async (e, name, fieldType) => {
    if (fieldType === "text") {
      dispatch({ type: fieldType, name: name, value: e });
    } else if (fieldType === "number") {
      dispatch({ type: fieldType, name: name, number: Number(e) });
    } else if (fieldType === "boolean") {
      dispatch({ type: fieldType, name: name, boolean: e });
    } else if (fieldType === "date") {
      dispatch({ type: 'text', name: name, value: e });
    } else if (fieldType === "select") {
if (name === 'FollowedUpStatus') {
        dispatch({ type: 'text', name: "followUpStatus", value: e.StatusName });
      }
      if(name === 'statusId'){
        dispatch({ type: 'text', name: "statusId", value: e._id });
        dispatch({ type: 'text', name: "statusName", value: e.statusName });
      }
      if(name === 'followedUpById'){
        dispatch({ type: 'text', name: "followedUpById", value: e._id });
        dispatch({ type: 'text', name: "followedUpByName", value: e.EmployeeName });
      }
      if(name ==='CityID'){
        dispatch({ type: 'text', name: "cityId", value: e.CityIDPK });
        dispatch({ type: 'text', name: "CityName", value: e.CityName });
      }
      if(name === "StateID"){
        dispatch({ type: 'text', name: 'StateID', value: e.StateIDPK });
        dispatch({ type: 'text', name: "StateName", value: e.StateName });
      }
      if(name === 'unitId'){
        dispatch({ type: 'text', name: 'unitId', value: e._id });
        dispatch({ type: 'text', name: "UnitName", value: e.UnitName });
      }
      if(name==='plotId'){
        dispatch({ type: 'text', name: 'plotId', value: e });
      }
      if(name === 'employeeId'){
        dispatch({ type: 'text', name: "employeeId", value: e._id });
        dispatch({ type: 'text', name: "employeeName", value: e.EmployeeName });
      }
    }
  }, []);
  const getPlotList = async () => {
    try {
      let url = config.Api + "Visitor/getAllPlots/";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unitId: state.unitId}),
      });

      if (!response.ok) {
        throw new Error('Failed to get State');
      }

      const result = await response.json();
      SetData(result.data)
      // setState(result)
      // setFilteredData(result)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
    const getUnitList = async () => {
      try {
        let url = config.Api + "Plot/getAllUnits/";
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get State');
        }
  
        const result = await response.json();
        SetData(result.data)
        // setState(result)
        // setFilteredData(result)
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }
  const getCityList = async () => {
    try {
      let url = config.Api + "City/getAllCitys";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({StateID:state.StateID}),
      });

      if (!response.ok) {
        throw new Error('Failed to get State');
      }

      const result = await response.json();
      SetData(result)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }  
    const getStateList = async () => {
    try {
      let url = config.Api + "State/getAllStates";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get State');
      }

      const result = await response.json();
      SetData(result)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }  
  const getStatusList = async () => {
    try {
      let url = config.Api + "Visitor/getAllStatus/";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unitId: state.unitId}),
      });

      if (!response.ok) {
        throw new Error('Failed to get State');
      }

      const result = await response.json();
      SetData(result.data)
      // setState(result)
      // setFilteredData(result)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const getEmployeeList = async () => {
    try {
      let url = config.Api + "Visitor/getAllEmployees/";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get State');
      }

      const result = await response.json();
      SetData(result.data)
      // setState(result)
      // setFilteredData(result)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const editTable = (data) => {
    setShowEntry(true);
    setHideAdd(false);
    setIsEdit(true);
    // setActive(data.isActive);
    dispatch({ type: 'text', name: '_id', value: data._id ? data._id : '' });
        dispatch({ type: 'text', name: "visitorCode", value: data.visitorCode ? data.visitorCode : '' });
       dispatch({ type: 'text', name: "visitorName", value: data.visitorName ? data.visitorName : '' });
       dispatch({ type: 'text', name: "visitorEmail", value: data.visitorEmail ? data.visitorEmail : '' });
       dispatch({ type: 'text', name: "visitorMobile", value: data.visitorMobile ? data.visitorMobile : '' });
       dispatch({ type: 'text', name: "visitorWhatsApp", value: data.visitorWhatsApp ? data.visitorWhatsApp : '' });
       dispatch({ type: 'text', name: "visitorPhone", value: data.visitorPhone ? data.visitorPhone : '' });
       dispatch({ type: 'text', name: "visitorAddress", value: data.visitorAddress ? data.visitorAddress : '' });
       dispatch({ type: 'text', name: "feedback", value: data.feedback ? data.feedback : '' });
       dispatch({ type: 'text', name: "description", value: data.description ? data.description : '' });
       dispatch({ type: 'text', name: "cityId", value: data.cityId._id });
        dispatch({ type: 'text', name: "CityName", value: data.cityId.CityName });;
        dispatch({ type: 'text', name: "StateID", value: data.cityId.StateID._id });
        dispatch({ type: 'text', name: "StateName", value: data.cityId.StateID.StateName });
        dispatch({ type: 'text', name: "employeeId", value: data.employeeId._id });
        dispatch({ type: 'text', name: "employeeName", value: data.employeeId.EmployeeName });
       setPlotDetails(data.plots)
       setFollowUpDetails(data.followUps)
     }
  const EditFollowup = (data)=>{
    dispatch({ type: 'text', name: "followUpId", value: data._id ? data._id : '' });
    dispatch({ type: 'text', name: "followUpDate", value: data.followUpDate ? data.followUpDate.split('T')[0].split('-').reverse().join('-') : '' });
    dispatch({ type: 'text', name: "followedUpById", value: data.followedUpById._id ? data.followedUpById._id : '' });
    dispatch({ type: 'text', name: "followedUpByName", value: data.followedUpById.EmployeeName ? data.followedUpById.EmployeeName : '' });
    dispatch({ type: 'text', name: "followUpStatus", value: data.followUpStatus ? data.followUpStatus : '' });
    dispatch({ type: 'text', name: "followUpDescription", value: data.followUpDescription ? data.followUpDescription : '' });
    dispatch({ type: 'text', name: "notes", value: data.notes ? data.notes : '' });
    dispatch({ type: 'text', name: "remarks", value: data.remarks ? data.remarks : '' });
    setAddFollow(true)
    setfollowUpEdit(true)
  }
    const EditPlot = (data)=>{
    dispatch({ type: 'text', name: "plotId", value: data.plotId._id ? data.plotId._id : '' });
    dispatch({ type: 'text', name: "plotNumber", value: data.plotId.plotNumber ? data.plotId.plotNumber :''});
    dispatch({ type: 'text', name: "unitId", value: data.plotId.unitId._id ? data.plotId.unitId._id : '' });
    dispatch({ type: 'text', name: "UnitName", value: data.plotId.unitId.UnitName ? data.plotId.unitId.UnitName : '' });
    dispatch({ type: 'text', name: "statusId", value: data.statusId._id ? data.statusId._id : '' });
    dispatch({ type: 'text', name: "statusName", value: data.statusId.statusName ? data.statusId.statusName :''});
    setAddFollow(true)
    setPlotEdit(true)
  }
  const deleteRow = async (data) => {
    try {
      let url = config.Api + "Employee/deleteEmployee";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete Employee');
      }

      const result = await response.json();
      getVisitor();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const handleView = (row) => {
    setViewData({"Visitor Code":row.visitorCode,
                 "Visitor Name":row.visitorName,
                })
  setOpen(true)
};
  return (
    <>
    <ViewDataModal open={open} onClose={() => setOpen(false)} data={Viewdata} />
      <Loading loading={loading}>
        {showentry && 
          <div className='entryParentDiv'>
            {props.alert?.show && (
              <Stack className='Stackstyle' spacing={2}>
                <Alert severity={props.alert.type} onClose={() => props.alert({ ...props.alert, show: false })}>
                  <AlertTitle>{props.alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                  {props.alert.message}
                </Alert>
              </Stack>
            )}
 <GridItem sm={12} xs={12} lg={12} md={12}>

 <div className="savebtndiv">
                  {/* <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={active}  
                          onChange={(event) => {
                            setActive(event.target.checked);  
                          }}
                          color="secondary"
                        />
                      }
                      label={active ? "Active" : "Inactive"}  
                    />
                  </FormGroup> */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={Validate}
                    className='ButtonStyle'
                  >
                    {loading ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update' : 'Save')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setHideAdd(!hideAdd)
                      setShowEntry(!showentry)
                      setIsEdit(false)
                      setAddFollow(false)
                    }}
                    className='ButtonStyle'
                  >
                    Close
                  </Button>
                </div>
              </GridItem>
            <div className='entrymain'>
             
              <div className="entryfirstcolmn">
                <div >
                                      <p style={{
  backgroundColor: '#1976d2',
  color: '#fff',
  paddingLeft: '10px',
  borderRadius: '5px',
}}><b>Visitor Details</b></p>
                  <GridContainer spacing={2}>
                           {/* <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="VisitorCode"
                     name="VisitorCode"
                     type='text'
                     label="Visitor Code"
                     value={state.VisitorCode}
                     length={5}
                     onChange={(e, value) => { storeDispatch(value, "VisitorCode", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "VisitorCode",value:""});}}
                    }
                   /> 
               </GridItem> */}
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="VisitorName"
                     name="VisitorName"
                     type='text'
                     label="Visitor Name"
                     value={state.visitorName}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "visitorName", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "visitorName",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                      //  mandatory={true}
                     id="VisitorEmail"
                     name="VisitorEmail"
                     type='text'
                     label="Email"
                     value={state.visitorEmail}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "visitorEmail", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "visitorEmail",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="VisitorMobile"
                     name="VisitorMobile"
                     type='number'
                     label="Mobile"
                     Phone={true}
                     value={state.visitorMobile}
                     length={10}
                     onChange={(e, value) => { storeDispatch(value, "visitorMobile", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "visitorMobile",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                      //  mandatory={true}
                     id="visitorWhatsApp"
                     name="visitorWhatsApp"
                     type='number'
                     label="WhatsApp"
                     Phone={true}
                     value={state.visitorWhatsApp}
                     length={10}
                     onChange={(e, value) => { storeDispatch(value, "visitorWhatsApp", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "visitorWhatsApp",value:""});}}
                    }
                   /> 
               </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                      //  mandatory={true}
                     id="visitorPhone"
                     name="visitorPhone"
                     type='number'
                     label="Phone number"
                     Phone={true}
                     value={state.visitorPhone}
                     length={10}
                     onChange={(e, value) => { storeDispatch(value, "visitorPhone", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "visitorPhone",value:""});}}
                    }
                   /> 
               </GridItem>
                         <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>State</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["State"]}
                      fieldName="State"
                      refid={'StateIDPK'}
                      refname={["StateName"]}
                      Visiblefields={["StateName"]}
                      height="35px"
                      onChange={() => { getStateList() }}
                      getKey={(e) => { storeDispatch(e, 'StateID', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.StateName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: 'StateID', value: "" });
                          dispatch({ type: 'text', name: "StateName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>
             <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>City</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["City"]}
                      fieldName="City"
                      refid={'CityIDPK'}
                      refname={["CityName"]}
                      disabled={state.StateID ? false : true}
                      Visiblefields={["CityName"]}
                      height="35px"
                      onChange={() => { getCityList() }}
                      getKey={(e) => { storeDispatch(e, 'CityID', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.CityName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: 'cityId', value: "" });
                          dispatch({ type: 'text', name: "CityName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextAreaCustom                    
                       mandatory={true}
                     id="visitorAddress"
                     name="visitorAddress"
                     type='text'
                     label="Address"
                     value={state.visitorAddress}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "visitorAddress", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "visitorAddress",value:""});}}
                    }
                   /> 
               </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextAreaCustom                    
                      //  mandatory={true}
                     id="feedback"
                     name="feedback"
                     type='text'
                     label="Feedback"
                     value={state.feedback}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "feedback", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "feedback",value:""});}}
                    }
                   /> 
               </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextAreaCustom                    
                      //  mandatory={true}
                     id="description"
                     name="description"
                     type='text'
                     label="Description"
                     value={state.description}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "description", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "description",value:""});}}
                    }
                   /> 
               </GridItem>
                               <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Reference</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Employee Name"]}
                      fieldName="Referred By"
                      refid={'_Id'}
                      refname={["EmployeeName"]}
                      Visiblefields={["EmployeeName"]}
                      height="35px"
                      onChange={() => { getEmployeeList() }}
                      getKey={(e) => { storeDispatch(e, 'employeeId', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.employeeName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: "employeeId", value: "" });
                          dispatch({ type: 'text', name: "employeeName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>
                    </GridContainer>
                                 {isEdit ? <div>
                                             <Box sx={{ width: '100%', bgcolor: 'background.paper',height:'35px' }}>
                                            <Tabs value={OrderTab} onChange={(e,value)=>{
                                             if(value == 0){
                                               setOrderTab('Follow Up')
                                             }else if (value == 1){
                                               setOrderTab('Plot Details')
                                             }
                                            }} 
                                            aria-label="nav tabs example"
                                            centered
                                            sx={{ height: '35px', minHeight: '35px' }}
                                            >
                                             <Tab label="Follow Up" sx={{backgroundColor: OrderTab === 'Follow Up' ?  '#4697f7' : '#dedede',color: OrderTab === 'Follow Up' ? 'white' : 'black',borderRadius:'5px 0px 0px 5px',height:'35px',minHeight: '35px'}}/>
                                             <Tab label="Plot Details" sx={{backgroundColor: OrderTab === 'Plot Details' ?  '#4697f7' : '#dedede',color: OrderTab === 'Plot Details' ? 'white' : 'black',height:'35px',minHeight: '35px',borderRadius:'0px 5px 5px 0px'}}/>
                                           </Tabs>
                                           </Box>
                                           </div> : ''}
                      <p style={{
  backgroundColor: '#1976d2',
  color: '#fff',
  paddingLeft: '10px',
  borderRadius: '5px',
  marginTop:'10px'
}}><b>{OrderTab === 'Follow Up' ? 'Follow Up Details' : 'Plot Details'}</b></p>
           <div className='AddbtnDiv' style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
              {(isEdit && !AddFollow) ? (
                <Button variant="contained" onClick={() => {setAddFollow(true);
                  cleaerFollowUp()
                  clearPlot()
                 }} className="ButtonStyle">{OrderTab === 'Follow Up' ? 'Add Follow up' : 'Add Plot'}</Button>
               ):''} 
                 {(AddFollow && isEdit) && 
                 <div style={{width:'14%',display:'flex',justifyContent:'space-between'}}>
       <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={OrderTab === 'Follow Up' ? ValidateFollowUp : ValidatePlot}
                    className='ButtonStyle'
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setAddFollow(false)
                    }}
                    className='ButtonStyle'
                  >
                    Close
                  </Button>
                  </div>}
                  </div>
                
   {(!state._id || (AddFollow && OrderTab === 'Follow Up')) && <GridContainer spacing={2}>
  <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <div>
                    <label><b>Follow Up Date</b></label>
                    <span style={{ color: "red" }}>*</span>
                   <CustomDatePicker
                       label="Follow Up Date"
                       value={state.followUpDate}
                       onChange={(val) => storeDispatch(val,'followUpDate','text')}
                       minDate={true}
                       disabled={false}
                    />
                    </div>
               </GridItem>                    
                <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Assign</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Employee Name"]}
                      fieldName="Employee Name"
                      refid={'_Id'}
                      refname={["EmployeeName"]}
                      Visiblefields={["EmployeeName"]}
                      height="35px"
                      onChange={() => { getEmployeeList() }}
                      getKey={(e) => { storeDispatch(e, 'followedUpById', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.followedUpByName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: "followedUpById", value: "" });
                          dispatch({ type: 'text', name: "followedUpByName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Follow Up Status</b></label>
                    {/* <span style={{ color: "red" }}>*</span> */}
                    <DropDown
                      options={Status}
                      heading={["Status"]}
                      fieldName="Status"
                      disabled={state.followUpId ? false : true}
                      refid={'_Id'}
                      refname={["Status"]}
                      FilterOptions={(val)=>{
                           setFilterValue(val)
                      }}
                      Visiblefields={["StatusName"]}
                      height="35px"
                      onChange={() => {  }}
                      getKey={(e) => { storeDispatch(e, 'FollowedUpStatus', 'select') }}
                      totalCount={Status.length}
                      loading={true}
                      value={state.followUpStatus}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: "followUpStatus", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                      //  mandatory={true}
                     id="followUpDescription"
                     name="followUpDescription"
                     type='text'
                     label="Follow Up Description"
                     value={state.followUpDescription}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "followUpDescription", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "followUpDescription",value:""});}}
                    }
                   /> 
               </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="notes"
                     name="notes"
                     type='text'
                     label="Notes"
                     value={state.notes}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "notes", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "notes",value:""});}}
                    }
                   /> 
               </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                      //  mandatory={true}
                     id="remarks"
                     name="remarks"
                     type='text'
                     label="Remarks"
                     value={state.remarks}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "remarks", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "remarks",value:""});}}
                    }
                   /> 
               </GridItem>
      </GridContainer> }
      {(isEdit && AddFollow && OrderTab !== 'Follow Up') &&  <GridContainer spacing={2}>
       {!PlotEdit && <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Unit</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Unit"]}
                      fieldName="Unit"
                      refid={'_Id'}
                      refname={["UnitName"]}
                      Visiblefields={["UnitName"]}
                      height="35px"
                      onChange={() => { getUnitList() }}
                      getKey={(e) => { storeDispatch(e, 'unitId', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.UnitName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: 'unitId', value: "" });
                          dispatch({ type: 'text', name: "UnitName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>}
           {!PlotEdit ?  <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Plot Number</b></label>
                    {/* <span style={{ color: "red" }}>*</span> */}
                    <DropDownMulti
                      options={Data}
                      heading={["Plot Number"]}
                      fieldName="Plot Number"
                      refid={'_id'}
                      refname={["plotNumber"]}
                      Visiblefields={["plotNumber"]}
                      height="35px"
                      onChange={() => { getPlotList() }}
                      getKey={(e) => { storeDispatch(e, 'plotId', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      NoToolTip={true}
                      value={state.plotNumber}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: 'plotId', value: "" });
                          dispatch({ type: 'text', name: "plotNumber", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem> :
                                <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Plot Number</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Plot Number"]}
                      fieldName="Plot Number"
                      refid={'_id'}
                      refname={["plotNumber"]}
                      Visiblefields={["plotNumber"]}
                      height="35px"
                      disabled={true}
                      onChange={() => { getPlotList() }}
                      getKey={(e) => { storeDispatch(e, 'plotId', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.plotNumber}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: 'plotId', value: "" });
                          dispatch({ type: 'text', name: "plotNumber", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>}
                <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Status</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Status"]}
                      fieldName="Status"
                      refid={'_Id'}
                      refname={["statusName"]}
                      Visiblefields={["statusName"]}
                      height="35px"
                      onChange={() => { getStatusList() }}
                      getKey={(e) => { storeDispatch(e, 'statusId', 'select') }}
                      totalCount={Data.length}
                      NoToolTip={true}
                      loading={true}
                      value={state.statusName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: "statusId", value: "" });
                          dispatch({ type: 'text', name: "statusName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>
      </GridContainer>}
        {(state._id && !AddFollow) ? <DataTable
      // title="Follow up List"
      columns={OrderTab === 'Follow Up' ? FollowUpColumns : PlotColumns}
      data={OrderTab === 'Follow Up' ? FollowUpDetails : PlotDetails}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    /> : ''}
                </div>
              </div>
            </div>
          </div>}
         {!showentry &&  <div className={showentry ? 'VisitorTabelAndAddDivActive' : 'TabelAndAddDiv'}>
          <div className='AddbtnDivMain'>
          <div className='badgesection'>
          </div>
          <div className='leftsideContent'>
          <div style={{display:'flex',width:'275px',justifyContent:'space-between'}}>
            <div className="WeeklyTaskSeacrhInput">
              <input
                type="text"
                id="searchTableInput"
                placeholder="Search here"
                className="form-control form-control-sm WeeklyTaskSerFil"
                value={searchTerm}
                onChange={(Event) => {
                  setSearchTerm(Event.target.value);
                  handleSearchChange(Event.target.value)
                }}
              />
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(Visitor)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'Employee List'} />
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                               <StyledTooltip title={"Refresh Table"} placement="top">
                              <TbRefresh onClick={()=>{if(!searchTerm){getVisitor()}}}/>
                              </StyledTooltip>
                              </div>
            </div>
            <div className='AddbtnDiv'>
              {(
                // props.UserPermissions.isAdd && 
              hideAdd) ? (
                <Button variant="contained" onClick={() => { setShowEntry(!showentry); setHideAdd(!hideAdd); clear() }} className="ButtonStyle">Add</Button>
              ):''}
            </div>
            </div>
          </div>
          <DataTable
      // title="Employee List"
      columns={columns}
      data={filteredData}
      // data={Employee}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
        </div>}
      </Loading>
    </>
  );
}