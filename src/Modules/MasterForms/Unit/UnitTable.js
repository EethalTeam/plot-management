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

const initialState = {
  _id: '',
    UnitName:'',    
   UnitLocation:'',
   UnitCode:'',
   isDispatchEnabled:false
 }
export default function UnitTable(props) {
  const headers = ["Unit Name","Unit Location","Unit Code","Enable Dispatch",'Active']
  const TableVisibleItem = ["UnitName","UnitLocation","UnitCode","isDispatchEnabled",'isActive']
    const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
const columns = [
  {
    name: 'Unit Name',
    selector: row => row.UnitName,
    sortable: true,
    width: '40%',
  },
//   {
//     name: 'Unit Location',
//     selector: row => row.UnitLocation,
//     sortable: true,
//     width: '20%',
//   },
  {name:"Unit Code",
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
  const [Unit, setUnit] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    getUnit()
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
      if (Unit.length > 0) {
        applySearchFilter(value);
      }
    }, 300)
  );

  const applySearchFilter = (search) => {
    if (Unit.length === 0) {
      return;
    }

    let data = [...Unit];
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
        dispatch({ type: 'text', name: "UnitName", value: "" });
       dispatch({ type: 'text', name: "UnitLocation", value: "" });
       dispatch({ type: 'text', name: "UnitCode", value: "" });
       dispatch({ type: 'boolean', name: "isDispatchEnabled", boolean: false });
     }

  const columnsConfig = [
     {label:"Unit Name", value: "UnitName" },
      {label:"Unit Location", value: "UnitLocation" },
      {label:"Unit Code", value: "UnitCode" },
      {label:"Enable Dispatch", value: "isDispatchEnabled" }
   ,
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
      if (!state.UnitName) {
    props.alert({ type: 'error', message: 'Please enter Unit Name', show: true });
    return;
  }
//      if (!state.UnitLocation) {
//     props.alert({ type: 'error', message: 'Please enter Unit Location', show: true });
//     return;
//   }
  if (!state.UnitCode) {
    props.alert({ type: 'error', message: 'Please enter Unit Code', show: true });
    return;
  }
         showAlert()
  }

  const showAlert = () => {
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
          await handleSubmit();
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
            UnitName : state.UnitName,
          UnitLocation : state.UnitLocation,
          UnitCode : state.UnitCode,
        //  isActive:active
    };
    const saveData={
            UnitName : state.UnitName,
          UnitLocation : state.UnitLocation,
          UnitCode : state.UnitCode,
          // isActive:active
    }

    try {
      if (isEdit) {
        await updateUnit(updateData);
        props.alert({ type: 'success', message: 'Unit Updated successfully!', show: true });
      } else {
        await createUnit(saveData);
        props.alert({ type: 'success', message: 'Unit created successfully!', show: true });
      }
      clear();
      getUnit();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update Unit.' : 'Failed to create Unit.');
    }
  };

  const getUnit = async () => {
    try {
      setLoading(true);
      let url = config.Api + "Unit/getAllUnits";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Unit');
      }
      setLoading(false);
      const result = await response.json();
      setUnit(result)
      setFilteredData(result);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const createUnit = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Unit/createUnit";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create Unit');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const updateUnit = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Unit/updateUnit";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to update Unit');
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
      let url = config.Api + "Unit/deleteUnit";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete Unit');
      }

      const result = await response.json();
      getUnit();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const handleView = (row) => {
    setViewData({"Unit Name":row.UnitName,
                 "Unit Location":row.UnitLocation,
                 "Unit Code":row.UnitCode,
                 "Dispatch Enabled":`${row.isDispatchEnabled ? "Yes" : "No"}`
                })
  setOpen(true)
};
  return (
    <>
    <ViewDataModal open={open} onClose={() => setOpen(false)} data={Viewdata} />
      <Loading loading={loading}>
        {showentry && (
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
                     <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'400px'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="UnitCode"
                     name="UnitCode"
                     type='text'
                     label="Unit Code"
                     value={state.UnitCode}
                     length={200}
                     onChange={(e, value) => { storeDispatch(value, "UnitCode", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "UnitCode",value:""});}}
                    }
                   /> 
               </GridItem>
                  <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'400px'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="UnitName"
                     name="UnitName"
                     type='text'
                     label="Unit Name"
                     value={state.UnitName}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "UnitName", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "UnitName",value:""});}}
                    }
                   /> 
               </GridItem>
                                                     {/* <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'390px'}}> 
                       <TextFieldCustom                    
                       mandatory={true}
                     id="UnitLocation"
                     name="UnitLocation"
                     type='text'
                     label="Unit Location"
                     value={state.UnitLocation}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "UnitLocation", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "UnitLocation",value:""});}}
                    }
                   /> 
               </GridItem> */}
               {/* <GridItem xs={6} md={6} lg={6} sm={6} style={{display:'flex',justifyContent:'flex-start',alignItems:'center',width:'390px'}}>
                <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.isDispatchEnabled}  
                          onChange={(event) => {
                            storeDispatch(event.target.checked, "isDispatchEnabled", "boolean")
                          }}
                          color="secondary"
                        />
                      }
                      label={state.isDispatchEnabled ? "Dispatch Enabled" : "Dispatch Disabled"}  
                    />
                  </FormGroup>
                  </GridItem> */}
                    </GridContainer>
                </div>
              </div>
            </div>
          </div>)}
          <div className={showentry ? 'TabelAndAddDivActive' : 'TabelAndAddDiv'}>
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
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(Unit)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'Unit List'} />
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                     <StyledTooltip title={"Refresh Table"} placement="top">
                    <TbRefresh onClick={()=>{if(!searchTerm){getUnit()}}}/>
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
      // title="Unit List"
      columns={columns}
      data={filteredData}
      // data={Unit}
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