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

const initialState = {
    _id: '',
    CityCode:'',
   CityName:'',
   StateID:'',
   StateName:''
 }
export default function CityTable(props) {
  const headers = ["City Code","State",'Active']
  const TableVisibleItem = ["CityCode","StateName",'isActive']
  const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
const columns = [
  {
    name: 'State',
    selector: row => row.StateName,
    sortable: true,
    width: '30%',
  },
   {
    name: 'City Name',
    selector: row => row.CityName,
    sortable: true,
    width: '30%',
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
  const [City, setCity] = useState([])
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
    getCity()
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
      if (City.length > 0) {
        applySearchFilter(value);
      }
    }, 300)
  );

  const applySearchFilter = (search) => {
    if (City.length === 0) {
      return;
    }

    let data = [...City];
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
        dispatch({ type: 'text', name: "CityCode", value: "" });
        dispatch({ type: 'text', name: "CityName", value: "" });
       dispatch({ type: 'text', name: "StateId", value: "" });
     }

  const columnsConfig = [
     {label:"City Code", value: "CityCode" },
      {label:"State", value: "StateName" }
   ,
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
      if (!state.CityCode) {
    props.alert({ type: 'error', message: 'Please enter City Code', show: true });
    return;
  }
        if (!state.CityName) {
    props.alert({ type: 'error', message: 'Please enter City Name', show: true });
    return;
  }
     if (!state.StateID) {
    props.alert({ type: 'error', message: 'Please Select State', show: true });
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
      StateID : state.StateID ,
      CityCode : state.CityCode,
      CityName : state.CityName,
    };
    const saveData={
          CityName:state.CityName,
          CityCode : state.CityCode,
          StateID:state.StateID
    }

    try {
      if (isEdit) {
        await updateCity(updateData);
        props.alert({ type: 'success', message: 'City Updated successfully!', show: true });
      } else {
        await createCity(saveData);
        props.alert({ type: 'success', message: 'City created successfully!', show: true });
      }
      clear();
      getCity();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update City.' : 'Failed to create City.');
    }
  };

  const getCity = async () => {
    try {
      setLoading(true);
      let url = config.Api + "City/getAllCitys";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Citys');
      }
      setLoading(false);
      const result = await response.json();
      setCity(result)
      setFilteredData(result);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const createCity = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "City/createCity";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create City');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const updateCity = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "City/updateCity";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to update City');
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
      if(name === 'StateID'){
        dispatch({ type: 'text', name: "StateID", value: e.StateIDPK });
        dispatch({ type: 'text', name: "StateName", value: e.StateName });
      }
    }
  }, []);
  const getStateList = async () => {
    try {
      let url = config.Api + "City/getAllStates/";
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
        dispatch({ type: 'text', name: "CityCode", value: data.CityCode ? data.CityCode : '' });
        dispatch({ type: 'text', name: "StateID", value: data.StateID ? data.StateID : '' });
       dispatch({ type: 'text', name: "StateName", value: data.StateName ? data.StateName : '' });
     }
  const deleteRow = async (data) => {
    try {
      let url = config.Api + "City/deleteCity";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete City');
      }

      const result = await response.json();
      getCity();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const handleView = (row) => {
    setViewData({"City Code":row.CityCode,
                 "State":row.StateName,
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
                           <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="CityCode"
                     name="CityCode"
                     type='text'
                     label="City Code"
                     value={state.CityCode}
                     length={5}
                     onChange={(e, value) => { storeDispatch(value, "CityCode", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "CityCode",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="CityName"
                     name="CityName"
                     type='text'
                     label="City Name"
                     value={state.CityName}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "CityName", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "CityName",value:""});}}
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
                      refid={'_Id'}
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
                                                </GridContainer>
                </div>
              </div>
            </div>
          </div>}
          <div className={showentry ? 'CityTabelAndAddDivActive' : 'TabelAndAddDiv'}>
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
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(City)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'City List'} />
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                               <StyledTooltip title={"Refresh Table"} placement="top">
                              <TbRefresh onClick={()=>{if(!searchTerm){getCity()}}}/>
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
      // title="City List"
      columns={columns}
      data={filteredData}
      // data={City}
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