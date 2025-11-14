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
import Checkbox from '@mui/material/Checkbox'
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
import { IoCloseCircleOutline } from "react-icons/io5";
import ViewDataModal from '../../../Components/CustomComponents/ViewData';
import CreateEasy from '../../../Components/CustomComponents/CreateEasy'

const initialState = {
  _id: '',
    RoleCode:'',
   RoleName:''
 }
export default function RoleBasedTable(props) {
  const headers = ["Role Based Code","Role Based Name",'Active']
  const TableVisibleItem = ["RoleCode","RoleName",'isActive']
    const [MenuAccess, setMenuAccess] = useState([
      { menuId: '',MenuName:'',isAdd:false ,isEdit:false ,isView:false ,isDelete:false },
    ]);
const [open, setOpen] = useState(false);
const [Viewdata,setViewData] = useState({})
const columns = [
  {
    name: 'Role Name',
    selector: row => row.RoleName,
    sortable: true,
    width: '25%',
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
        {/* {props.UserPermissions.isDelete &&<FaTrash
          onClick={() => DeleteAlert(row)}
          style={{ cursor: 'pointer', color: '#dc3545' }}
          title="Delete"
        />} */}
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
  const [RoleBased, setRoleBased] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [Data, SetData] = useState([])
  const [CreateEasyOpen, setCreateEasyOpen] = useState(false);
  const [CreateEasyDetails,setCreateEasyDetails] = useState({FormID:'',FormName:''})
  const [active, setActive] = useState(true);

  useEffect(() => {
    getRoleBased()
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
      if (RoleBased.length > 0) {
        // applySearchFilter(value);
         getRolesByName(value)
      }
    }, 100)
  );
    const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim()) {
        getRolesByName(value); // use the latest typed value directly
      } else {
        setFilteredData(RoleBased);
      }
    }, 500),
    [RoleBased]
  );
  const applySearchFilter = (search) => {
    if (RoleBased.length === 0) {
      return;
    }

    let data = [...RoleBased];
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
        dispatch({ type: 'text', name: "RoleCode", value: "" });
       dispatch({ type: 'text', name: "RoleName", value: "" });
       setMenuAccess([
      { menuId: '',MenuName:'',isAdd:false ,isEdit:false ,isView:false ,isDelete:false }
    ])
     }

  const columnsConfig = [
     {label:"RoleBased Code", value: "RoleCode" },
      {label:"RoleBased Name", value: "RoleName" }
   ,
   { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {

     if (!state.RoleName) {
    props.alert({ type: 'error', message: 'Please enter RoleBased Name', show: true });
    return;
  }

         handleSave()
  }
  const handleAddMenu = () => {
    if(!MenuAccess[MenuAccess.length - 1].menuId){
      props.alert({ type: 'error', message: 'Please complete the previous menu details', show: true })
      return false
    }
    if (!MenuAccess[MenuAccess.length - 1].menuId) {
      props.alert({ type: 'error', message: 'Please complete previous Menu Id', show: true })
      return false;
    }else if(!MenuAccess[MenuAccess.length - 1].isView && !MenuAccess[MenuAccess.length - 1].isEdit && !MenuAccess[MenuAccess.length - 1].isAdd && !MenuAccess[MenuAccess.length - 1].isDelete){
      props.alert({ type: 'error', message: 'Please complete previous Menu Access', show: true })
      return false;
    }
    setMenuAccess([
      ...MenuAccess,
      { menuId: '',MenuName:'',isAdd:false ,isEdit:false ,isView:false ,isDelete:false },
    ]);
  };
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
  const handleSave = () => {
    if (!state.RoleName) {
      props.alert({ type: 'error', message: 'Please enter the Role name', show: true })
      return false;
    } 
    if(!MenuAccess[0].menuId){
      props.alert({ type: 'error', message: 'Please add atleast one Menu', show: true })
      return false
    }
    let passed = true;
    let nameMap = new Map();
let duplicates = [];
for (const [index, val] of MenuAccess.entries()) {
    if (!val.menuId?.trim()) {
      props.alert({ type: 'error', message: `Please enter Menu in row ${index + 1}`, show: true })
        passed = false;
        break;
    }
    if (!val.isView && !val.isAdd && !val.isEdit && !val.isDelete) {
      props.alert({ type: 'error', message: `Please select Acceess for ${val.MenuName}`, show: true })
        passed = false;
        break;
    }
   
    if (nameMap.has(val.MenuName)) {
      duplicates.push({ MenuName: val.MenuName, indices: index + 1});
    } else {
      nameMap.set(val.MenuName, index);
    }
}
if (passed && duplicates.length > 0) {
  props.alert({ type: 'error', message: ` ${duplicates[0].MenuName} in row ${duplicates[0].indices} is already entered`, show: true })
return false
}

if (passed) {
  showAlert()
}
    
  };
  const handleSubmit = async () => {
    props.alert({ type: '', message: '', show: false });

    const updateData = {
      _id: state._id,
            RoleCode : state.RoleCode,
          RoleName : state.RoleName,
          permissions : MenuAccess,
         isActive:active
    };
    const saveData={
          RoleCode : state.RoleCode,
          RoleName : state.RoleName,
          permissions : MenuAccess,
          isActive:active
    }

    try {
      if (isEdit) {
        await updateRoleBased(updateData);
        props.alert({ type: 'success', message: 'RoleBased Updated successfully!', show: true });
      } else {
        await createRoleBased(saveData);
        props.alert({ type: 'success', message: 'RoleBased created successfully!', show: true });
      }
      clear();
      getRoleBased();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update RoleBased.' : 'Failed to create RoleBased.');
    }
  };

  const getRoleBased = async () => {
    try {
      setLoading(true);
      let url = config.Api + "RoleBased/getAllRoles";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get RoleBased');
      }
      setLoading(false);
      const result = await response.json();
      setRoleBased(result.data)
      setFilteredData(result.data);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
    const getRolesByName = async (val) => {
    try {
      setLoading(true);
      let filter={}
      if(val || state.RoleName){
        filter.RoleName = val || state.RoleName
      }
      let url = config.Api + "RoleBased/getRolesByName";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        throw new Error('Failed to get RoleBased');
      }
      setLoading(false);
      const result = await response.json();
      // setRoleBased(result)
      setFilteredData(result);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const createRoleBased = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "RoleBased/createRole";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create RoleBased');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const updateRoleBased = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "RoleBased/updateRole";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to update RoleBased');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
const handleFieldChange = (index, event) => {
  setMenuAccess(prev => {
    const newFields = [...prev];
    while (newFields.length <= index) {
      newFields.push({ menuId: '', MenuName: '',isAdd:false ,isEdit:false ,isView:false ,isDelete:false });
    }
    Object.assign(newFields[index], {
      menuId: event._id,
      MenuName: event.title
    });
    return newFields;
  });
};


    const handleFieldClear = (index) => {
    const newFields = [...MenuAccess];
    newFields[index]['menuId'] = ''
    newFields[index]['MenuName'] = ''
    setMenuAccess(newFields);
  };

  const storeDispatch = useCallback(async (e, name, fieldType,index) => {
    if (fieldType === "text") {
      dispatch({ type: fieldType, name: name, value: e });
    } else if (fieldType === "number") {
      dispatch({ type: fieldType, name: name, number: Number(e) });
    } else if (fieldType === "boolean") {
      dispatch({ type: fieldType, name: name, boolean: e });
    } else if (fieldType === "date") {
      dispatch({ type: 'text', name: name, value: e });
    } else if (fieldType === "select") {
        if(name === "MenuID"){
            handleFieldChange(index,e)
        }else if(name === "isAdd"){
  setMenuAccess(prev => {
    const newFields = [...prev];
    while (newFields.length <= index) {
      newFields.push({ menuId: '', MenuName: '',isAdd:false ,isEdit:false ,isView:false ,isDelete:false });
    }
    Object.assign(newFields[index], {
      isAdd:e
    });
    return newFields;
  });
        }
        else if(name === "isEdit"){
  setMenuAccess(prev => {
    const newFields = [...prev];
    while (newFields.length <= index) {
      newFields.push({ menuId: '', MenuName: '',isAdd:false ,isEdit:false ,isView:false ,isDelete:false });
    }
    Object.assign(newFields[index], {
      isEdit:e
    });
    return newFields;
  });
        }
        else if(name === "isView"){
  setMenuAccess(prev => {
    const newFields = [...prev];
    while (newFields.length <= index) {
      newFields.push({ menuId: '', MenuName: '',isAdd:false ,isEdit:false ,isView:false ,isDelete:false });
    }
    Object.assign(newFields[index], {
      isView:e
    });
    return newFields;
  });
        }
        else if(name === "isDelete"){
  setMenuAccess(prev => {
    const newFields = [...prev];
    while (newFields.length <= index) {
      newFields.push({ menuId: '', MenuName: '',isAdd:false ,isEdit:false ,isView:false ,isDelete:false });
    }
    Object.assign(newFields[index], {
      isDelete:e
    });
    return newFields;
  });
        }
    }
  }, []);
  const getMenu = async (val) => {
    // setLoading(true)
    try {
      let filter
      if(val || state.MenuName){
        filter={MenuName:val || state.MenuName}
      }else{
        filter={}
      }
      let url = config.Api + "RoleBased/getAllMenus";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        throw new Error('Failed to get State');
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
  const editTable = (data) => {
    setShowEntry(true);
    setHideAdd(false);
    setIsEdit(true);
    setActive(data.isActive);
    dispatch({ type: 'text', name: '_id', value: data._id ? data._id : '' });
        dispatch({ type: 'text', name: "RoleCode", value: data.RoleCode ? data.RoleCode : '' });
       dispatch({ type: 'text', name: "RoleName", value: data.RoleName ? data.RoleName : '' });
       setMenuAccess(data.permissions)
     }
  const deleteRow = async (data) => {
    try {
      let url = config.Api + "RoleBased/deleteRole";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete RoleBased');
      }

      const result = await response.json();
      getRoleBased();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const handleView = (row) => {
    setViewData({"Role Based Code":row.RoleCode,
                 "Role Based Name":row.RoleName,
                 "Menu Access Details" : row.permissions.map(({ MenuName,isAdd, isEdit, isView, isDelete}) => ({
                                                "Role Based Name":MenuName,
                                                "isAdd":isAdd ,"isEdit":isEdit ,"isView":isView ,"isDelete":isDelete 
                                              }))
                })
  setOpen(true)
};
  return (
    <>
    <ViewDataModal open={open} onClose={() => setOpen(false)} data={Viewdata} />
      <CreateEasy  open={CreateEasyOpen} onClose={() => setCreateEasyOpen(false)} FormID={CreateEasyDetails.FormID} FormName={CreateEasyDetails.FormName} alert={props.alert} UserPermissions={props.UserPermissions} />
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
                   {/* <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'400px'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="RoleCode"
                     name="RoleCode"
                     type='text'
                     label="RoleBased Code"
                     value={state.RoleCode}
                     length={10}
                     onChange={(e, value) => { storeDispatch(value, "RoleCode", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "RoleCode",value:""});}}
                    }
                   /> 
               </GridItem> */}
                    <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'390px'}}>
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
               {/* <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'70px',display:'flex',alignItems:'center'}}>
                        <Button variant="contained" disabled={!state.RoleName} onClick={handleAddMenu} className="ButtonStyle">Add</Button>
               </GridItem> */}
              
                                                </GridContainer>
                                                 <p style={{
  backgroundColor: '#1976d2',
  color: '#fff',
  paddingLeft: '10px',
  borderRadius: '5px',
}}><b>Menu Access Details</b></p>
 {MenuAccess.map((field, index) => (
          <div style={{display:'flex',marginTop:'10px'}} key={index}>
          <div style={{display:'flex',alignItems:'center',justifyContent:"center",paddingRight:'17px',marginLeft:'10px'}}>
          <IoCloseCircleOutline size={25} style={{color:'red'}} 
          onClick={()=>{ const updatedFields = [...MenuAccess]; 
            if(MenuAccess.length > 1){
        updatedFields.splice(index, 1);
        setMenuAccess(updatedFields);}else{
          props.alert({ type: 'error', message: 'Atleast one field is required', show: true})
        }}
          }
          />
          </div>
          <GridContainer spacing={2} style={{width:'100%'}}>
                
                <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'35%'}}>
                  <div>
                    <label><b>Menu Name</b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Menu Name"]}
                      fieldName="Menu"
                    //   createEasy={true}
                    //   openAddPopUp={(e)=>{setCreateEasyDetails({FormID:'1007',FormName:'Parent Product'});setCreateEasyOpen(e)}}
                      refid={'_id'}
                      refname={["title"]}
                      Visiblefields={["title"]}
                      FilterOptions={(val)=>{
                           debounce(
                              getMenu(val)
                            , 300)
                      }}
                      height="35px"
                      onChange={() => {
                        //  getMenu()
                        }}
                      getKey={(e) => {if(state.RoleName){
                         storeDispatch(e, 'MenuID', 'select',index) 
                         }else{
                        props.alert({ type: 'error', message: 'Please enter Role name', show: true });
                      }
                        }}
                      totalCount={Data.length}
                      loading={false}
                      value={field.MenuName || ''}
                      clear={(e) => {
                        if (e) {
                         handleFieldClear(index)
                        }
                      }}
                    />
                    </div>
                    </GridItem>
                     <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'10%',display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
                     <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.isAdd}  
                          onChange={(event) => {
                            storeDispatch(event.target.checked, 'isAdd', 'select',index)
                          }}
                          color="secondary"
                        />
                      }
                      label={"Add"}  
                    />
                  </FormGroup>
                  </GridItem>
                   <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'10%',display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
                     <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.isEdit}  
                          onChange={(event) => {
                            storeDispatch(event.target.checked, 'isEdit', 'select',index)
                          }}
                          color="secondary"
                        />
                      }
                      label={"Edit"}  
                    />
                  </FormGroup>
                  </GridItem>
                   <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'10%',display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
                     <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.isView}  
                          onChange={(event) => {
                            storeDispatch(event.target.checked, 'isView', 'select',index)
                          }}
                          color="secondary"
                        />
                      }
                      label={"View"}  
                    />
                  </FormGroup>
                  </GridItem>
                   <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'10%',display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
                     <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.isDelete}  
                          onChange={(event) => {
                            storeDispatch(event.target.checked, 'isDelete', 'select',index)
                          }}
                          color="secondary"
                        />
                      }
                      label={"Delete"}  
                    />
                  </FormGroup>
                  </GridItem>
 {MenuAccess.length-1 === index ?  <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'10%',display:'flex',alignItems:'flex-end'}}>
                        <Button variant="contained" disabled={!state.RoleName} onClick={handleAddMenu} className="ButtonStyle">Add</Button>
               </GridItem> :''}
               </GridContainer>
          </div>))}
             
                </div>
              </div>
            </div>
          </div>}
          <div className={showentry ? 'ParentProductTabelAndAddDivActive' : 'TabelAndAddDiv'}>
          <div className='AddbtnDivMain'>
          <div className='badgesection'>
          </div>
          <div className='leftsideContent'>
          {!showentry ? <div style={{display:'flex',width:'275px',justifyContent:'space-between'}}>
            <div className="WeeklyTaskSeacrhInput">
              <input
                type="text"
                id="searchTableInput"
                placeholder="Search here"
                className="form-control form-control-sm WeeklyTaskSerFil"
                value={searchTerm}
                onChange={(Event) => {
                  setSearchTerm(Event.target.value);
                  debouncedSearch(Event.target.value)
                }}
              />
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(RoleBased)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'RoleBased List'} />
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                               <StyledTooltip title={"Refresh Table"} placement="top">
                              <TbRefresh onClick={()=>{if(!searchTerm){getRoleBased()}}}/>
                              </StyledTooltip>
                              </div>
            </div> : ''}
            <div className='AddbtnDiv'>
              {(props.UserPermissions.isAdd && hideAdd) ? (
                <Button variant="contained" onClick={() => { setShowEntry(!showentry); setHideAdd(!hideAdd); clear() }} className="ButtonStyle">Add</Button>
              ):''}
            </div>
            </div>
          </div>
          {!showentry ? <DataTable
      // title="RoleBased List"
      columns={columns}
      data={filteredData}
      // data={RoleBased}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    /> : ''}
        </div>
      </Loading>
    </>
  );
}