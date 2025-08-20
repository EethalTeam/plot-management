import { useState, useReducer, useCallback, useEffect } from 'react'
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
import ExportTableToExcel from "../../../Components/CustomComponents/ExportTableToExcel";
import GridContainer from '../../../Components/CustomComponents/GridContainer';
import GridItem from '../../../Components/CustomComponents/GridItem';
import DataTable from 'react-data-table-component';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { TbRefresh } from "react-icons/tb";
import StyledTooltip from '../../../Components/CustomComponents/Tooltip'
import ViewDataModal from '../../../Components/CustomComponents/ViewData';

const initialState = {
  _id: '',
    RoleName:'',
   RoleCode:'',
 }
export default function RoleTable(props) {
    const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
const columns = [
  {
    name: 'Role Name',
    selector: row => row.RoleName,
    sortable: true,
    width: '40%',
  },
  {name:"Role Code",
   selector: row => row.RoleCode,
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
  const [Role, setRole] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [active, setActive] = useState(true);
console.log(active)
  useEffect(() => {
    getRole()
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
      if (Role.length > 0) {
        applySearchFilter(value);
      }
    }, 300)
  );

  const applySearchFilter = (search) => {
    if (Role.length === 0) {
      return;
    }

    let data = [...Role];
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
        dispatch({ type: 'text', name: "RoleName", value: "" });
       dispatch({ type: 'text', name: "RoleCode", value: "" });
     }

  const columnsConfig = [
     {label:"Role Name", value: "RoleName" },
      {label:"Role Code", value: "RoleCode" },
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
      if (!state.RoleName) {
    props.alert({ type: 'error', message: 'Please enter Role Name', show: true });
    return;
  }
  if (!state.RoleCode) {
    props.alert({ type: 'error', message: 'Please enter Role Code', show: true });
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
            RoleName : state.RoleName,
          RoleCode : state.RoleCode,
        //  isActive:active
    };
    const saveData={
            RoleName : state.RoleName,
          RoleCode : state.RoleCode,
          // isActive:active
    }

    try {
      if (isEdit) {
        await updateRole(updateData);
        props.alert({ type: 'success', message: 'Role Updated successfully!', show: true });
      } else {
        await createRole(saveData);
        props.alert({ type: 'success', message: 'Role created successfully!', show: true });
      }
      clear();
      getRole();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update Role.' : 'Failed to create Role.');
    }
  };

  const getRole = async () => {
    try {
      setLoading(true);
      let url = config.Api + "Role/getAllRoles";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Role');
      }
      setLoading(false);
      const result = await response.json();
      setRole(result)
      setFilteredData(result);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const createRole = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Role/createRole";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create Role');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const updateRole = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Role/updateRole";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to update Role');
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
        dispatch({ type: 'text', name: "RoleName", value: data.RoleName ? data.RoleName : '' });
       dispatch({ type: 'text', name: "RoleCode", value: data.RoleCode ? data.RoleCode : '' });
     }
  const deleteRow = async (data) => {
    try {
      let url = config.Api + "Role/deleteRole";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete Role');
      }

      const result = await response.json();
      getRole();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const handleView = (row) => {
    setViewData({"Role Name":row.RoleName,
                 "Role Code":row.RoleCode
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
                     id="RoleCode"
                     name="RoleCode"
                     type='text'
                     label="Role Code"
                     value={state.RoleCode}
                     length={200}
                     onChange={(e, value) => { storeDispatch(value, "RoleCode", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "RoleCode",value:""});}}
                    }
                   /> 
               </GridItem>
                  <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'400px'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="RoleName"
                     name="RoleName"
                     type='text'
                     label="Role Name"
                     value={state.RoleName}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "RoleName", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "RoleName",value:""});}}
                    }
                   /> 
               </GridItem>
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
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(Role)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'Role List'} />
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                     <StyledTooltip title={"Refresh Table"} placement="top">
                    <TbRefresh onClick={()=>{if(!searchTerm){getRole()}}}/>
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
      // title="Role List"
      columns={columns}
      data={filteredData}
      // data={Role}
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