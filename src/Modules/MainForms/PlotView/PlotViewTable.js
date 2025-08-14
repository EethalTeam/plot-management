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
import { TbRefresh } from "react-icons/tb";
import StyledTooltip from '../../../Components/CustomComponents/Tooltip'
import ViewDataModal from '../../../Components/CustomComponents/ViewData';
import PlotViewComp from './PlotViewComp'
import { Modal, Box, Typography, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DropDown from '../../../Components/CustomComponents/DataList'


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

const bounceAnimation = `
@keyframes bounceIn {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 1;
  }
  80% {
    transform: translate(-50%, -50%) scale(0.95);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
`;

const initialState = {
  _id: '',
  statusId:'',
  statusName:'',
  visitorId:'',
  visitorName:'',
  UnitName:'',
  unitId:''
 }
export default function PlotViewTable(props) {
  const headers = ["PlotView Name","PlotView Location","PlotView Code","Enable Dispatch",'Active']
  const TableVisibleItem = ["UnitName","UnitLocation","UnitCode","isDispatchEnabled",'isActive']
    const [open, setOpen] = useState(false);
     const [openVisitor,setopenVisitor] = useState(false)
    const [Viewdata,setViewData] = useState({})
    const [RowData,setRowData] = useState({})
const columns = [
  {
    name: 'PlotView Name',
    selector: row => row.UnitName,
    sortable: true,
    width: '40%',
  },
//   {
//     name: 'PlotView Location',
//     selector: row => row.UnitLocation,
//     sortable: true,
//     width: '20%',
//   },
  {name:"PlotView Code",
   selector: row => row.UnitCode,
   sortable: true,
   width: '40%',
  },
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
  const [PlotView, setPlotView] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [Data, SetData] = useState([])
  const [CreateEasyOpen, setCreateEasyOpen] = useState(false);
  const [CreateEasyDetails,setCreateEasyDetails] = useState({FormID:'',FormName:''})
  const [active, setActive] = useState(true);
    const [PlotStatus,setPlotStatus] = useState([
      {PlotStatusIDPK:5,PlotStatusName:"Visited"},
      {PlotStatusIDPK:5,PlotStatusName:"Interested"},
      {PlotStatusIDPK:4,PlotStatusName:"Hold By"},
      {PlotStatusIDPK:2,PlotStatusName:"Reserved By"},
      {PlotStatusIDPK:3,PlotStatusName:"Booked By"},
      {PlotStatusIDPK:1,PlotStatusName:"Sold To"}
    ])


  useEffect(() => {
    getPlotView()
  }, [])
  useEffect(() => {
    getPlotView(state.unitId)
  }, [state.unitId])
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
      if (PlotView.length > 0) {
        applySearchFilter(value);
      }
    }, 300)
  );

  const applySearchFilter = (search) => {
    if (PlotView.length === 0) {
      return;
    }

    let data = [...PlotView];
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
    setopenVisitor(false)
    setOpen(false)
    dispatch({ type: 'text', name: '_id', value: "" });
        dispatch({ type: 'text', name: "statusName", value: "" });
       dispatch({ type: 'text', name: "visitorId", value: "" });
       dispatch({ type: 'text', name: "visitorName", value: "" });
     }

  const columnsConfig = [
     {label:"PlotView Name", value: "UnitName" },
      {label:"PlotView Location", value: "UnitLocation" },
      {label:"PlotView Code", value: "UnitCode" },
      {label:"Enable Dispatch", value: "isDispatchEnabled" }
   ,
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
      if (!state.statusName) {
    props.alert({ type: 'error', message: 'Please select status', show: true });
    return;
  }
  if (!state.visitorId) {
    props.alert({ type: 'error', message: 'Please select the visitor', show: true });
    return;
  }
         showAlert()
  }

  const showAlert = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to Update this data?',
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
          await handleSubmit().then(res=>{
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
          }).catch(err=>{
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
      plotId: state._id
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
    const saveData={

    }

    try {
      // if (isEdit) {
        await updatePlotStatus(updateData).then(res=>{
          if(res){
      clear();
      getPlotView();
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

  const getPlotView = async (val) => {
    try {
      setLoading(true);
      let url = config.Api + "Plot/getAllPlots";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unitId:val}),
      });

      if (!response.ok) {
        throw new Error('Failed to get PlotView');
      }
      setLoading(false);
      const result = await response.json();
      setPlotView(result.data)
      setFilteredData(result.data);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const createUnit = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "PlotView/createUnit";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create PlotView');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
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
           if(name ==='VisitorID'){
            dispatch({ type: 'text', name: 'visitorId', value: e._id });
            dispatch({ type: 'text', name: 'visitorName', value: e.visitorName });
           }
           if(name ==='PlotStatusID'){
            dispatch({ type: 'text', name: "statusName", value: e.PlotStatusName });
           }
           if(name ==='unitId'){
            dispatch({ type: 'text', name: "unitId", value: e._id });
            dispatch({ type: 'text', name: "UnitName", value: e.UnitName });
           }
    }
  }, []);

  const editTable = (data) => {
    setShowEntry(true);
    setHideAdd(false);
    setIsEdit(true);
    // setActive(data.isActive);
    dispatch({ type: 'text', name: '_id', value: data._id ? data._id : '' });
        dispatch({ type: 'text', name: "UnitName", value: data.UnitName ? data.UnitName : '' });
       dispatch({ type: 'text', name: "UnitLocation", value: data.UnitLocation ? data.UnitLocation : '' });
       dispatch({ type: 'text', name: "UnitCode", value: data.UnitCode ? data.UnitCode : '' });
       dispatch({ type: 'boolean', name: "isDispatchEnabled", boolean: data.isDispatchEnabled ? data.isDispatchEnabled : false });
     }
  const deleteRow = async (data) => {
    try {
      let url = config.Api + "PlotView/deleteUnit";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete Plot Status.');
      }

      const result = await response.json();
      getPlotView();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const handleView = (row) => {
    setViewData({"Plot Number":row.plotNumber,
                 "Unit":row.unitId.UnitName,
                 "Plot Dimension":row.dimension,
                 "Plot facing":row.facing,
                 "Land Mark":row.landmark,
                 "Road":row.road,
                 "Plot Status":row.statusId.statusName,
                 "Plot Area in SQ.ft":row.areaInSqFt,
                 "Cent":row.cents
                })
  setOpen(true)
};
const handleAddVisitor = (row)=>{
    setRowData(row)
    dispatch({ type: 'text', name: '_id', value: row._id ? row._id : '' });
    setopenVisitor(true)
}
  return (
    <>
    <ViewDataModal open={open} onClose={() => setOpen(false)} data={Viewdata} header={'Plot Details'}/>
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
                      <IconButton onClick={()=>{setopenVisitor(false)}}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
  <Loading loading={loading}>
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
                    onClick={Validate}
                    className='ButtonStyle'
                  >
                    {loading ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update' : 'Update Status')}
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
      </Loading>
                      </Box>
        </Fade>
      </Modal>
    
      <PlotViewComp 
      plots={PlotView}
      handleView={handleView} 
      handleAddVisitor={handleAddVisitor} 
      state={state}
      dispatch={dispatch}
      Data={Data}
      storeDispatch={storeDispatch}
      getUnitList={getUnitList}
      />
    </>
  );
}