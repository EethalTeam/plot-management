import React, { useState, useReducer, useCallback, useEffect } from 'react'
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
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
import DropDown from '../../../Components/CustomComponents/DataList'
import '../../../Assets/app.css'
import { TbRefresh } from "react-icons/tb";
import StyledTooltip from '../../../Components/CustomComponents/Tooltip'
import ViewDataModal from '../../../Components/CustomComponents/ViewData';
import { decode as base64_decode, encode as base64_encode} from "base-64";
import MenuListing from './MenuList'

const initialState = {
  _id: '',
  unitId:'',
  UnitName:'',
  employeeId:'',
   EmployeeName:''
 }
export default function UserRightsTable(props) {
  const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
const columns = [
  {
    name: 'Employee Code',
    selector: row => row.employeeCode,
    sortable: true,
    width: '25%',
  },
  {
    name: 'Employee Name',
    selector: row => row.employeeName,
    sortable: true,
    width: '25%',
  },
  {
    name: 'Role',
    selector: row => row.employeeRole,
    sortable: true,
    width: '25%',
  },
  // {
  //   name: 'Add',
  //   selector: row => row.isAdd,
  //   sortable: true,
  //   cell: row => (
  //     <FaCircle
  //       color={row.isAdd ? 'green' : 'red'}
  //       title={row.isAdd ? 'Enabled' : 'Disabled'}
  //       size={12}
  //     />
  //   ),
  //   center: true,
  // },
  //  {
  //   name: 'Edit',
  //   selector: row => row.isEdit,
  //   sortable: true,
  //   cell: row => (
  //     <FaCircle
  //       color={row.isEdit ? 'green' : 'red'}
  //       title={row.isEdit ? 'Enabled' : 'Disabled'}
  //       size={12}
  //     />
  //   ),
  //   center: true,
  // },
  //    {
  //   name: 'View',
  //   selector: row => row.isView,
  //   sortable: true,
  //   cell: row => (
  //     <FaCircle
  //       color={row.isView ? 'green' : 'red'}
  //       title={row.isView ? 'Enabled' : 'Disabled'}
  //       size={12}
  //     />
  //   ),
  //   center: true,
  // },
  //    {
  //   name: 'Delete',
  //   selector: row => row.isDelete,
  //   sortable: true,
  //   cell: row => (
  //     <FaCircle
  //       color={row.isDelete ? 'green' : 'red'}
  //       title={row.isDelete ? 'Enabled' : 'Disabled'}
  //       size={12}
  //     />
  //   ),
  //   center: true,
  // },
  {
    name: 'Actions',
    cell: row => (
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* <FaEye
          onClick={() => handleView(row)}
          style={{ cursor: 'pointer', color: '#007bff' }}
          title="View"
        /> */}
        <FaEdit
          onClick={() => editTable(row)}
          style={{ cursor: 'pointer', color: '#ffc107' }}
          title="Edit"
        />
        {/* <FaTrash
          onClick={() => DeleteAlert(row)}
          style={{ cursor: 'pointer', color: '#dc3545' }}
          title="Delete"
        /> */}
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: '25%',
  },
];


  const [showentry, setShowEntry] = useState(false)
  const [loading, setLoading] = useState(false);
  const [hideAdd, setHideAdd] = useState(true);
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [UserRights, setParentProduct] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [Data, SetData] = useState([])
  const [Menu, SetMenu] = useState([])
  const [MenuAction,setMenuAction] = useState([])
  const [ProductDetails,setProductDetails] = useState({ProductCode:'',UnitName:'',ProductIDPK:'',ProductVisibleCode:'',ProductVisibleName:''})

  const [active, setActive] = useState(true);

  useEffect(() => {
    getAllUserRights()
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
      if (UserRights.length > 0) {
        applySearchFilter(value);
      }
    }, 300)
  );

  const applySearchFilter = (search) => {
    if (UserRights.length === 0) {
      return;
    }

    let data = [...UserRights];
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
    dispatch({ type: 'text', name: "unitId", value: "" });
    dispatch({ type: 'text', name: "UnitName", value: "" });
    dispatch({ type: 'text', name: "employeeId", value: "" });
       dispatch({ type: 'text', name: "EmployeeName", value: "" });
       SetMenu([])
       setMenuAction([])
     }

  const columnsConfig = [
     {label:"UserRights Code", value: "mainParentProductCode" },
      {label:"UserRights Name", value: "mainParentProductName" }
   ,
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
    if (!state.employeeId) {
    props.alert({ type: 'error', message: 'Please select Employee', show: true });
    return;
  }
         showAlert()
  }

  const showAlert = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: isEdit ? 'Do you really want to Update this data?' : 'Do you really want to add this data?',
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

    const updateData={
      _id:state._id,
      employeeId:state.employeeId,
      menus:MenuAction         
    }
    const saveData={
      employeeId:state.employeeId,
      menus:MenuAction
    }
    if(!isEdit){
      AddUserRights(saveData)
    }else{
updateUserRights(updateData)
    }
   
  };

  const getAllUserRights = async () => {
    try {
      setLoading(true);
      let url = config.Api + "UserRights/getAllUserRights";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unitId: state.unitId}),
      });

      if (!response.ok) {
        throw new Error('Failed to get UserRights');
      }
      setLoading(false);
      const result = await response.json();
      setParentProduct(result)
      setFilteredData(result);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const AddUserRights = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "UserRights/createUserRights/";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create Employee');
      }
      const result = await response.json();
      getAllUserRights()
     clear()
     setShowEntry(false)
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const updateUserRights = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "UserRights/updateUserRights/";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (response.status === 400) {
        const result = await response.json();
        throw new Error(result.message);
      }
      const result = await response.json();
      getAllUserRights()
      clear()
      setShowEntry(false)
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const storeDispatch = useCallback(async (e, name, fieldType,productidpk,productname) => {
    if (fieldType === "text") {
      dispatch({ type: fieldType, name: name, value: e });
    } else if (fieldType === "number") {
      dispatch({ type: fieldType, name: name, number: Number(e) });
    } else if (fieldType === "boolean") {
      dispatch({ type: fieldType, name: name, boolean: e });
    } else if (fieldType === "date") {
      dispatch({ type: 'text', name: name, value: e });
    } else if (fieldType === "select") {
  if (name === 'UnitID') {
        dispatch({ type: 'text', name: "UnitName", value: e.UnitName  });
        dispatch({ type: 'text', name: 'unitId', value: e._id});
        getAllMenus(e._id)
      }else if (name === 'EmployeeID') {
        dispatch({ type: 'text', name: "employeeId", value: e._id });
        dispatch({ type: 'text', name: "EmployeeName", value: e.EmployeeName });
      }
    }
  }, []);

      const getAllEmployees = async () => {
        try {
          let url = config.Api + "UserRights/getAllEmployees/";
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
          SetData(result)
          // setState(result)
        //   setFilteredData(result)
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
      const getAllMenus = async (id) => {
        try {
          let url = config.Api + "UserRights/getAllMenus/";
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({unitId: id}),
          });
    
          if (!response.ok) {
            throw new Error('Failed to get State');
          }
    
          const result = await response.json();
          SetMenu(result)
          // setState(result)
        //   setFilteredData(result)
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
  const getUserRights = async () => {
    try {
      let url = config.Api + "UserRights/getAllUserRights";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unitId: state.unitId}),
      });

      if (!response.ok) {
        throw new Error('Failed to get UserRights');
      }
      const result = await response.json();
      SetData(result)
    //   setFilteredData(result);
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
    dispatch({ type: 'text', name: "unitId", value: data.unitId ? data.unitId : '' });
    dispatch({ type: 'text', name: "UnitName", value: data.UnitName ? data.UnitName : '' });
    dispatch({ type: 'text', name: "employeeId", value: data.employeeId ? data.employeeId : '' });
    dispatch({ type: 'text', name: "EmployeeName", value: data.employeeName ? data.employeeName : '' });
    SetMenu(data.menus)
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
        throw new Error('Failed to delete UserRights');
      }

      const result = await response.json();
      getUserRights();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const getMenuAction=(val)=>{
     setMenuAction(val)
  }
  const handleView = (row) => {
    setViewData({"Employee Code":row.EmployeeCode,
                 "Employee Name":row.EmployeeName,
                 "Product":row.UnitName,
                 "ProductType":row.EmployeeName,
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
                    {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update' : 'Add User Rights')}
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
                {/* <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'300px'}}>
                  <div>
                    <label><b>Employee</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Employee Code","Employee Name"]}
                      fieldName="Employee Name"
                      refid={"_id"}
                      refname={["EmployeeCode","EmployeeName"]}
                      Visiblefields={["EmployeeCode","EmployeeName"]}
                      height="35px"
                      onChange={() => { getAllEmployees() }}
                      getKey={(e) => { storeDispatch(e, 'EmployeeID', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      disabled={!state.UnitName}
                      value={state.EmployeeName}
                      clear={(e) => {
                        if (e) {
                           dispatch({ type: 'text', name: 'employeeId', value: "" });
                          dispatch({ type: 'text', name: "EmployeeName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem> */}
                <MenuListing menuData={Menu} getMenuAction={getMenuAction}/>
                    
                
                                                </GridContainer>
                </div>
              </div>
            </div>
          </div>
            }
          <div className={showentry ? 'TabelAndAddDivActive' : 'TabelAndAddDiv'}>
          <div className='AddbtnDivMain'>
          <div className='badgesection'>
          </div>
          <div className='leftsideContent'>
          {!showentry ?  <div style={{display:'flex',width:'275px',justifyContent:'space-between'}}>
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
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(UserRights)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'Employee List'} />
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                               <StyledTooltip title={"Refresh Table"} placement="top">
                              <TbRefresh onClick={()=>{if(!searchTerm){getAllUserRights()}}}/>
                              </StyledTooltip>
                              </div>
            </div> :''}
            <div className='AddbtnDiv'>
              {/* {(props.UserPermissions.isAdd && hideAdd) ? (
                <Button variant="contained" onClick={() => { setShowEntry(!showentry); setHideAdd(!hideAdd); clear() }} className="ButtonStyle">Add</Button>
              ):''} */}
            </div>
            </div>
          </div>
          {!showentry ? <DataTable
      columns={columns}
      data={filteredData}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    /> :''}
        </div>
      </Loading>
    </>
  );
}