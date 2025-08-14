import React, { useState, useReducer, useCallback, useEffect } from 'react'
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import MuiTableCustom from '../../../Components/CustomComponents/MuiTableCustom';
import Loading from '../../../Components/CustomComponents/Loading';
import Reducer from '../../../Components/Reducer/commonReducer';
import TextFieldCustom from '../../../Components/CustomComponents/textField';
import TextAreaCustom from '../../../Components/CustomComponents/TextArea';
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

const initialState = {
  _id: '',
    EmployeeCode:'',
   EmployeeName:'',
   employeeEmail:'',
   employeePhone:'',
   employeeAddress:'',
   password:'',
   employeeRole:''
 }
export default function DepartmentTable(props) {
  const headers = ["Employee Code","Employee Name",'Active']
  const TableVisibleItem = ["EmployeeCode","EmployeeName",'isActive']
  const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
const columns = [
  {
    name: 'Employee Code',
    selector: row => row.EmployeeCode,
    sortable: true,
    width: '20%',
  },
  {
    name: 'Employee Name',
    selector: row => row.EmployeeName,
    sortable: true,
    width: '20%',
  },
    {
    name: 'Role',
    selector: row => row.employeeRole,
    sortable: true,
    width: '15%',
  },
      {
    name: 'Phone Number',
    selector: row => row.employeePhone,
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
  const [Employee, setEmployee] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [Data, SetData] = useState([])
  const [Role,setRole] = useState([{RoleIDPK:1,RoleName:"admin"},
    {RoleIDPK:2,RoleName:"agent"}
  ])
  const [active, setActive] = useState(true);

  useEffect(() => {
    getEmployee()
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
    dispatch({ type: 'text', name: "employeeEmail", value: "" });
    dispatch({ type: 'text', name: "employeePhone", value: "" });
        dispatch({ type: 'text', name: "EmployeeCode", value: "" });
       dispatch({ type: 'text', name: "EmployeeName", value: "" });
       dispatch({ type: 'text', name: "password", value: "" });
       dispatch({ type: 'text', name: "employeeRole", value: "" });
       dispatch({ type: 'text', name: "employeeAddress", value: '' });
     }

  const columnsConfig = [
     {label:"Employee Code", value: "EmployeeCode" },
      {label:"Employee Name", value: "EmployeeName" }
   ,
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
      if (!state.EmployeeCode) {
    props.alert({ type: 'error', message: 'Please enter Employee Code', show: true });
    return;
  }
     if (!state.EmployeeName) {
    props.alert({ type: 'error', message: 'Please enter Employee Name', show: true });
    return;
  }
  if (!state.employeeEmail) {
    props.alert({ type: 'error', message: 'Please enter Email', show: true });
    return;
  }
    if (!state.employeePhone) {
    props.alert({ type: 'error', message: 'Please enter phone number', show: true });
    return;
  }
    if (!state.password) {
    props.alert({ type: 'error', message: 'Please enter password', show: true });
    return;
  }
    if (!state.employeeRole) {
    props.alert({ type: 'error', message: 'Please select Role', show: true });
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
          EmployeeCode : state.EmployeeCode,
          EmployeeName : state.EmployeeName,
          password :  state.password,
          employeeRole : state.employeeRole,
          employeeEmail : state.employeeEmail,
          employeePhone : state.employeePhone,
          employeeAddress : state.employeeAddress
        //  isActive:active
    };
    const saveData={
          EmployeeCode : state.EmployeeCode,
          EmployeeName : state.EmployeeName,
          password :  state.password,
          employeeRole : state.employeeRole,
          employeeEmail : state.employeeEmail,
          employeePhone : state.employeePhone,
          employeeAddress : state.employeeAddress
          // isActive:active
    }

    try {
      if (isEdit) {
        await updateEmployee(updateData);
        props.alert({ type: 'success', message: 'Employee Updated successfully!', show: true });
      } else {
        await createEmployee(saveData);
        props.alert({ type: 'success', message: 'Employee created successfully!', show: true });
      }
      clear();
      getEmployee();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update Employee.' : 'Failed to create Employee.');
    }
  };

  const getEmployee = async () => {
    try {
      setLoading(true);
      let url = config.Api + "Employee/getAllEmployees";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Employee');
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

  const createEmployee = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Employee/createEmployee";
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
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const updateEmployee = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Employee/updateEmployee";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to update Employee');
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
  if (name === 'DepartmentID') {
        dispatch({ type: 'text', name: 'employeeEmail', value: e.DepartmentIDPK });
        dispatch({ type: 'text', name: "employeePhone", value: e.employeePhone });
      }else if (name === 'employeeRole') {
        dispatch({ type: 'text', name: "employeeRole", value: e.RoleName });
      }
    }
  }, []);

  const editTable = (data) => {
    setShowEntry(true);
    setHideAdd(false);
    setIsEdit(true);
    // setActive(data.isActive);
    dispatch({ type: 'text', name: '_id', value: data._id ? data._id : '' });
    dispatch({ type: 'text', name: "employeeEmail", value: data.employeeEmail ? data.employeeEmail : '' });
    dispatch({ type: 'text', name: "employeePhone", value: data.employeePhone ? data.employeePhone : '' });
    dispatch({ type: 'text', name: "password", value: data.password ? data.password : '' });
    dispatch({ type: 'text', name: "employeeRole", value: data.employeeRole ? data.employeeRole : '' });
        dispatch({ type: 'text', name: "EmployeeCode", value: data.EmployeeCode ? data.EmployeeCode : '' });
       dispatch({ type: 'text', name: "EmployeeName", value: data.EmployeeName ? data.EmployeeName : '' });
       dispatch({ type: 'text', name: "employeeAddress", value: data.employeeAddress ? data.employeeAddress : '' });
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
      getEmployee();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const handleView = (row) => {
    setViewData({"Employee Code":row.EmployeeCode,
                 "Employee Name":row.EmployeeName,
                 "Department":row.employeePhone,
                 "Role":row.employeeRole,
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
                     id="EmployeeCode"
                     name="EmployeeCode"
                     type='text'
                     label="Employee Code"
                     value={state.EmployeeCode}
                     length={10}
                     onChange={(e, value) => { storeDispatch(value, "EmployeeCode", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "EmployeeCode",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="EmployeeName"
                     name="EmployeeName"
                     type='text'
                     label="Employee Name"
                     value={state.EmployeeName}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "EmployeeName", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "EmployeeName",value:""});}}
                    }
                   /> 
               </GridItem>

                 <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="employeeEmail"
                     name="employeeEmail"
                     type='email'
                     label="Employee Email"
                     value={state.employeeEmail}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "employeeEmail", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "employeeEmail",value:""});}}
                    }
                   /> 
               </GridItem>
                 <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="employeePhone"
                     name="employeePhone"
                     type='number'
                     Phone={true}
                     label="Phone Number"
                     value={state.employeePhone}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "employeePhone", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "employeePhone",value:""});}}
                    }
                   /> 
               </GridItem>
                 <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'30%'}}>
                       <TextAreaCustom                    
                       mandatory={true}
                     id="employeeAddress"
                     name="employeeAddress"
                     type='text'
                     Phone={true}
                     label="Address"
                     value={state.employeeAddress}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "employeeAddress", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "employeeAddress",value:""});}}
                    }
                   /> 
               </GridItem>

<GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="password"
                     name="password"
                     type='text'
                     label="Password"
                     value={state.password}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "password", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "password",value:""});}}
                    }
                   /> 
               </GridItem>
                 <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Role</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Role}
                      heading={["Employee Role"]}
                      fieldName="Employee Role"
                      refid={'RoleIDPK'}
                      refname={["RoleName"]}
                      Visiblefields={["RoleName"]}
                      height="35px"
                      onChange={() => {  }}
                      getKey={(e) => { storeDispatch(e, 'employeeRole', 'select') }}
                      totalCount={Role.length}
                      loading={true}
                      value={state.employeeRole}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: "employeeRole", value: "" });
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
          <div className={showentry ? 'EmployeeTabelAndAddDivActive' : 'TabelAndAddDiv'}>
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
                              <TbRefresh onClick={()=>{if(!searchTerm){getEmployee()}}}/>
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