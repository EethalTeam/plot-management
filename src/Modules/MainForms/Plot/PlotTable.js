import React, { useState, useReducer, useCallback, useEffect } from 'react'
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import MuiTableCustom from '../../../Components/CustomComponents/MuiTableCustom';
import Loading from '../../../Components/CustomComponents/Loading';
import Reducer from '../../../Components/Reducer/commonReducer';
import TextFieldCustom from '../../../Components/CustomComponents/textField';
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
import '../../../Assets/app.css'
import { TbRefresh } from "react-icons/tb";
import StyledTooltip from '../../../Components/CustomComponents/Tooltip'
import ViewDataModal from '../../../Components/CustomComponents/ViewData';
import { Modal, Box, Typography, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IoPersonAdd } from "react-icons/io5";

const initialState = {
    _id: '',
    plotCode:'',
   plotNumber:'',
   dimension:'',
   areaInSqFt:'',
   cents:'',
   road:'',
   landmark:'',
   isActive:'',
   remarks:'',
   description:'',
   statusId:'',
   statusName:'',
   visitorId:'',
   visitorName:'',
   facing:'',
   unitId:'',
   UnitName:''
 }
export default function PlotTable(props) {
  const headers = ["Plot Code","Unit",'Active']
  const TableVisibleItem = ["plotCode","UnitName",'isActive']
  const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
    
  const [RowData, setRowData] = useState({})
  const [openVisitor,setopenVisitor] = useState(false)
      const [PlotStatus,setPlotStatus] = useState([
        {PlotStatusIDPK:5,PlotStatusName:"Visited"},
        {PlotStatusIDPK:5,PlotStatusName:"Interested"},
        {PlotStatusIDPK:4,PlotStatusName:"Hold By"},
        {PlotStatusIDPK:2,PlotStatusName:"Reserved By"},
        {PlotStatusIDPK:3,PlotStatusName:"Booked By"},
        {PlotStatusIDPK:1,PlotStatusName:"Sold To"}
      ])
  
const columns = [
  {
    name: 'Unit',
    selector: row => row.unitId.UnitName,
    sortable: true,
    width: '10%',
  },
   {
    name: 'Plot Number',
    selector: row => row.plotNumber,
    sortable: true,
    width: '15%',
  },
  {
    name: 'Status',
    // selector: row => row.statusId.statusName,
     cell: row => (
     <div style={{backgroundColor:row.statusId.colorCode,padding:'12px',borderRadius:'4px'}}>{row.statusId.statusName}</div>
    ),
    sortable: true,
    width: '12%',
  },
   {
    name: 'Area in sq.ft',
    selector: row => row.areaInSqFt,
    sortable: true,
    width: '15%',
  },
   {
    name: 'Cents',
    selector: row => row.cents,
    sortable: true,
    width: '10%',
  },
   {
    name: 'Facing',
    selector: row => row.facing,
    sortable: true,
    width: '11%',
  },
  //  {
  //   name: 'Landmark',
  //   selector: row => row.landmark,
  //   sortable: true,
  //   width: '13%',
  // },
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
        {props.UserPermissions.isEdit &&<FaEdit
          onClick={() => editTable(row)}
          style={{ cursor: 'pointer', color: '#ffc107' }}
          title="Edit"
        />}
        {/* {props.UserPermissions.isDelete &&<FaTrash
          onClick={() => DeleteAlert(row)}
          style={{ cursor: 'pointer', color: '#dc3545' }}
          title="Delete"
        />} */}
        {/* {props.UserPermissions.isAdd && */}
        <IoPersonAdd 
          onClick={() => handleAddVisitor(row)}
          style={{ cursor: 'pointer', color: '#2cff41ff' }}
          title="Add Visitor"
        />
        {/* } */}
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

  const [showentry, setShowEntry] = useState('')
  const [loading, setLoading] = useState(false);
  const [hideAdd, setHideAdd] = useState(true);
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [Employee, setEmployee] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue,setFilterValue] = useState('')
  const [Data, SetData] = useState([])
  const [Facing,setFacing] = useState([{FacingIDPK:1,FacingName:"South"},
    {FacingIDPK:2,FacingName:"North"},
    {FacingIDPK:3,FacingName:"West"},
    {FacingIDPK:4,FacingName:"East"},
    {FacingIDPK:5,FacingName:"NE"},
    {FacingIDPK:6,FacingName:"NW"},
    {FacingIDPK:7,FacingName:"SE"},
    {FacingIDPK:8,FacingName:"SW"}
  ])
  const [active, setActive] = useState(true);

  useEffect(() => {
    getPlot()
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
      if (Employee.length > 0) {
        applySearchFilter(value);
      }
    }, 300)
  );

  const applySearchFilter = (search) => {
    if (Employee.length === 0) {
      return;
    }

    let data = [...Employee];
    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    setFilteredData(filtered);
  };
  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) scale(1)',
  bgcolor: 'white',
  borderRadius: '5px',
  boxShadow: 24,
  width: '90%',
  maxWidth: 1000,
  maxHeight: '90vh',
  overflow: 'hidden', // Important!
  animation: 'bounceIn 0.5s ease',
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
        dispatch({ type: 'text', name: "plotCode", value: "" });
       dispatch({ type: 'text', name: "UnitName", value: "" });
       dispatch({ type: 'text', name: "statusName", value: "" });
       dispatch({ type: 'text', name: "visitorId", value: "" });
       dispatch({ type: 'text', name: "visitorName", value: "" });
     }

  const columnsConfig = [
     {label:"Plot Code", value: "plotCode" },
      {label:"Unit", value: "UnitName" }
   ,
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
  //     if (!state.plotCode) {
  //   props.alert({ type: 'error', message: 'Please enter Plot Code', show: true });
  //   return;
  // }
     if (!state.unitId) {
    props.alert({ type: 'error', message: 'Please enter Unit', show: true });
    return;
  }
         showAlert()
  }
    const ValidateVisitor = () => {
      if (!state.statusName) {
    props.alert({ type: 'error', message: 'Please select status', show: true });
    return;
  }
  if (!state.visitorId) {
    props.alert({ type: 'error', message: 'Please select the visitor', show: true });
    return;
  }
         showAlert('Visitor')
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
         val === 'Visitor' ? await handleVisitorSubmit() : await handleSubmit();
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
      unitId : state.unitId ,
            plotCode : state.plotCode,
          UnitName : state.UnitName,
        //  isActive:active
    };
    const saveData={
          plotNumber:state.plotNumber,
   dimension:state.dimension,
   areaInSqFt:state.areaInSqFt,
   cents:state.cents,
   road:state.road,
   landmark:state.landmark,
   remarks:state.remarks,
   description:state.description,
   facing:state.facing,
   unitId:state.unitId

          // isActive:active
    }

    try {
      if (isEdit) {
        await updatePlot(updateData);
        props.alert({ type: 'success', message: 'Plot Updated successfully!', show: true });
      } else {
        await createPlot(saveData);
        props.alert({ type: 'success', message: 'Plot created successfully!', show: true });
      }
      clear();
      getPlot();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update Plot.' : 'Failed to create Plot.');
    }
  };
    const handleVisitorSubmit = async () => {
    props.alert({ type: '', message: '', show: false });

    const updateData = {
      plotId: RowData._id
    };
    if(state.statusName === 'Sold To'){
       updateData.soldToVisitorId=state.visitorId
    }else if(state.statusName === 'Reserved By'){
       updateData.reservedBy = state.visitorId
    }else if(state.statusName === 'Hold By'){
       updateData.holdBy = state.visitorId
    }else if(state.statusName === 'Booked By'){
       updateData.bookedBy = state.visitorId
    }else if(state.statusName === 'Interested'){
       updateData.interestedBy = state.visitorId
    }else if(state.statusName === 'Visited'){
       updateData.visitedBy = state.visitorId
    }


    try {
      // if (isEdit) {
        await updatePlotStatus(updateData).then(res=>{
          if(res){
      clear();
      setopenVisitor(false)
          }else{
             throw new Error('Failed to update Plot Status.');
          }
        });
      // } else {
      //   await createUnit(saveData);
      //   props.alert({ type: 'success', message: 'PlotView created successfully!', show: true });
      // }
      
    } catch (error) {
      throw new Error('Failed to update Plot Status.');
    }
  };
  const updatePlotStatus = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Plot/updatePlotStatus";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      // if (response.status === 400) {
      //   props.alert({ type: 'error', message: response.message, show: true });
      //   return false
      // }

      const result = await response.json();
             if (response.status === 400) {
        props.alert({ type: 'error', message: result.message, show: true });
        return false
      }else{
        props.alert({ type: 'success', message: result.message, show: true });
        return result;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
const handleAddVisitor = (row)=>{
    setRowData(row)
    dispatch({ type: 'text', name: '_id', value: row._id ? row._id : '' });
    setopenVisitor(true)
}
  const getPlot = async () => {
    try {
      setLoading(true);
      let url = config.Api + "Plot/getAllPlots";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Plots');
      }
      setLoading(false);
      const result = await response.json();
      setEmployee(result.data)
      setFilteredData(result.data);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const createPlot = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Plot/createPlot";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create Plot');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const updatePlot = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Plot/updatePlot";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to update Plot');
      }

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
      if (name === 'FollowedUpFacing') {
        dispatch({ type: 'text', name: "facing", value: e.FacingName });
      }
      if(name === 'statusId'){
        dispatch({ type: 'text', name: "statusId", value: e._id });
        dispatch({ type: 'text', name: "statusName", value: e.statusName });
      }
      if(name === 'unitId'){
        dispatch({ type: 'text', name: "unitId", value: e._id });
        dispatch({ type: 'text', name: "UnitName", value: e.UnitName });
      }
      if(name === 'facing'){
        dispatch({ type: 'text', name: "facing", value: e.FacingName });
      }
      if(name ==='VisitorID'){
            dispatch({ type: 'text', name: 'visitorId', value: e._id });
            dispatch({ type: 'text', name: 'visitorName', value: e.visitorName });
           }
      if(name ==='PlotStatusID'){
       dispatch({ type: 'text', name: "statusName", value: e.PlotStatusName });
      }
    }
  }, []);
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
  const getStatusList = async () => {
    try {
      let url = config.Api + "Plot/getAllStatus/";
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
    dispatch({ type: 'text', name: '_id', value: data._id ? data._id :'' });
    dispatch({ type: 'text', name: "plotCode", value: data.plotCode ? data.plotCode :'' });
        dispatch({ type: 'text', name: "plotNumber", value: data.plotNumber ? data.plotNumber :'' });
       dispatch({ type: 'text', name: "areaInSqFt", value: data.areaInSqFt ? data.areaInSqFt :'' });
       dispatch({ type: 'text', name: "cents", value: data.cents ? data.cents :'' });
       dispatch({ type: 'text', name: "road", value: data.road ? data.road :'' });
       dispatch({ type: 'text', name: "landmark", value: data.landmark ? data.landmark :'' });
       dispatch({type:'text',name: "dimension",value:data.dimension ? data.dimension :''});
       dispatch({type:'text',name: "remarks",value:data.remarks ? data.remarks :''});
       dispatch({type:'text',name: "description",value:data.description ? data.description :''});
       dispatch({type:'text',name: "statusId",value:data.statusId._id ? data.statusId._id :''});
       dispatch({type:'text',name: "statusName",value:data.statusId.statusName ? data.statusId.statusName :''});
       dispatch({type:'text',name: "visitorId",value:data.visitorId ? data.visitorId :''});
       dispatch({type:'text',name: "visitorName",value:data.visitorName ? data.visitorName :''});
       dispatch({type:'text',name: "facing",value:data.facing ? data.facing :''});
       dispatch({type:'text',name: "unitId",value:data.unitId._id ? data.unitId_id :''});
       dispatch({type:'text',name: "UnitName",value:data.unitId.UnitName ? data.unitId.UnitName :''});
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
      getPlot();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
      const getVisitor = async (val) => {
        // setLoading(true)
        try {
          let filter
          if(val || state.visitorName){
            filter={visitorName:val || state.visitorName}
          }else{
            filter={}
          }
          let url = config.Api + "Plot/getAllVisitors/";
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(filter),
          });
    
          if (!response.ok) {
            throw new Error('Failed to get Visitor');
          }
    // setLoading(false)
          const result = await response.json();
          SetData(result)
          // setState(result)
        //   setFilteredData(result)
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
  const handleView = (row) => {
    setViewData({"Plot Code":row.plotCode,
                 "Unit":row.UnitName,
                })
  setOpen(true)
};
  return (
    <>
    <ViewDataModal open={open} onClose={() => setOpen(false)} data={Viewdata} />
             <Modal open={openVisitor} onClose={()=>{setopenVisitor(false)}} closeAfterTransition>
                <Fade in={openVisitor}>
                  <Box sx={{ ...style, p: 0, display: 'flex', flexDirection: 'column' }}>                  
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
                      <Typography variant="h6"><b>Add Visitor</b></Typography>
                      <IconButton onClick={()=>{clear();setopenVisitor(false)}}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
        {/* {showentry && ( */}
          <div className='entryParentDiv' style={{height:'60vh'}}>
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={ValidateVisitor}
                    className='ButtonStyle'
                  >
                    {loading ? 'Adding Visitor' : 'Add Visitor'}
                  </Button>
                  {/* <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setHideAdd(!hideAdd)
                      setShowEntry(!showentry)
                    }}
                    className='ButtonStyle'
                  >
                    Close
                  </Button> */}
                </div>
              </GridItem>
            <div className='entrymain'>
             
              <div className="entryfirstcolmn">
                <div >
                  <GridContainer spacing={2}>
                     <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'400px'}}>
                  <div>
                    <label><b>Status</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={PlotStatus}
                      heading={["Status"]}
                      fieldName="Status"
                      refid={'PlotStatusIDPK'}
                      refname={["PlotStatusName"]}
                      Visiblefields={["PlotStatusName"]}
                      height="35px"
                      // onChange={() => { getStatusList() }}
                      getKey={(e) => { storeDispatch(e, 'PlotStatusID', 'select') }}
                      totalCount={PlotStatus.length}
                      loading={true}
                      value={state.statusName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: "statusName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>
                   <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'35%'}}>
                                    <div>
                                      <label><b>Visitor</b></label>
                                      <span style={{ color: "red" }}>*</span>
                                      <DropDown
                                        options={Data}
                                        heading={["Visitor Name"]}
                                        fieldName="Visitor Name"
                                        // createEasy={true}
                                        // openAddPopUp={(e)=>{setCreateEasyDetails({FormID:'1007',FormName:'Parent Product'});setCreateEasyOpen(e)}}
                                        refid={'_id'}
                                        refname={["Visitor Name"]}
                                        Visiblefields={["visitorName"]}
                                        FilterOptions={(val)=>{
                                             debounce(
                                                getVisitor(val)
                                              , 300)
                                        }}
                                        height="35px"
                                        onChange={() => {
                                          //  getParentProduct()
                                          }}
                                        getKey={(e) => {storeDispatch(e, 'VisitorID', 'select')}}
                                        totalCount={Data.length}
                                        loading={false}
                                        value={state.visitorName || ''}
                                        clear={(e) => {
                                          if (e) {
                                              dispatch({ type: 'text', name: "visitorId", value: "" });
                                              dispatch({ type: 'text', name: "visitorName", value: "" });
                                            }
                                        }}
                                      />
                                      </div>
                                      </GridItem>
                    </GridContainer>
                </div>
              </div>
            </div>
          </div>
        {/* )} */}
          {/* <div className={showentry ? 'TabelAndAddDivActive' : 'TabelAndAddDiv'}>
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
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(PlotView)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'PlotView List'} />
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                     <StyledTooltip title={"Refresh Table"} placement="top">
                    <TbRefresh onClick={()=>{if(!searchTerm){getPlotView()}}}/>
                    </StyledTooltip>
                    </div>
            </div>
            <div className='AddbtnDiv'>
              {(
                hideAdd) ? (
                <Button variant="contained" onClick={() => { setShowEntry(!showentry); setHideAdd(!hideAdd); clear() }} className="ButtonStyle">Add</Button>
              ):''}
            </div>
            </div>
          </div>

           <DataTable
      columns={columns}
      data={filteredData}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
        </div> */}
                      </Box>
        </Fade>
      </Modal>
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
                  <GridContainer spacing={2}>
                           {/* <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="plotCode"
                     name="plotCode"
                     type='text'
                     label="Plot Code"
                     value={state.plotCode}
                     length={5}
                     onChange={(e, value) => { storeDispatch(value, "plotCode", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "plotCode",value:""});}}
                    }
                   /> 
               </GridItem> */}
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="plotNumber"
                     name="plotNumber"
                     type='text'
                     label="Plot Number"
                     value={state.plotNumber}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "plotNumber", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "plotNumber",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="Dimension"
                     name="Dimension"
                     type='text'
                     label="Dimension"
                     value={state.dimension}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "dimension", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "dimension",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="AreaInSqFt"
                     name="AreaInSqFt"
                     type='number'
                     label="Area in sq ft"
                     value={state.areaInSqFt}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "areaInSqFt", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "areaInSqFt",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="cents"
                     name="Cents"
                     type='number'
                     Decimals={true}
                     label="Cents"
                     value={state.cents}
                     length={4}
                     onChange={(e, value) => { storeDispatch(value, "cents", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "cents",value:""});}}
                    }
                   /> 
               </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="road"
                     name="road"
                     type='text'
                     label="Road"
                     value={state.road}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "road", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "road",value:""});}}
                    }
                   /> 
               </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="landmark"
                     name="landmark"
                     type='text'
                     label="Landmark"
                     value={state.landmark}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "landmark", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "landmark",value:""});}}
                    }
                   /> 
               </GridItem>
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
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
               <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
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
                <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'400px'}}>
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
                    </GridItem>
                 <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'400px'}}>
                                  <div>
                                    <label><b>Facing</b></label>
                                    <span style={{ color: "red" }}>*</span>
                                    <DropDown
                                      options={Facing}
                                      heading={["Facing"]}
                                      fieldName="Facing"
                                      refid={'_Id'}
                                      refname={["Facing"]}
                                      FilterOptions={(val)=>{
                                           setFilterValue(val)
                                      }}
                                      Visiblefields={["FacingName"]}
                                      height="35px"
                                      onChange={() => {  }}
                                      getKey={(e) => { storeDispatch(e, 'facing', 'select') }}
                                      totalCount={Facing.length}
                                      loading={true}
                                      value={state.facing}
                                      clear={(e) => {
                                        if (e) {
                                          dispatch({ type: 'text', name: "facing", value: "" });
                                        }
                                      }}
                                    />
                                    </div>
                                    </GridItem>
                {/* <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'400px'}}>
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
                    </GridItem> */}
                                                </GridContainer>
                </div>
              </div>
            </div>
          </div>}
          <div className={showentry ? 'PlotTabelAndAddDivActive' : 'TabelAndAddDiv'}>
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
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(Employee)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'Employee List'} />
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                               <StyledTooltip title={"Refresh Table"} placement="top">
                              <TbRefresh onClick={()=>{if(!searchTerm){getPlot()}}}/>
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
          {/* <MuiTableCustom
            headers={headers}
            data={filteredData}
            delete={(val) => deleteRow(val)}
            edit={(data) => { editTable(data) }}
            TableVisibleItem={TableVisibleItem}
            Deletedisabled
          /> */}
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
        </div>
      </Loading>
    </>
  );
}