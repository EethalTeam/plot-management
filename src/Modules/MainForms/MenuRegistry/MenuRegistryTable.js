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
import { Checkbox, FormGroup, FormControlLabel, FormLabel, Box } from '@mui/material';
import ToggleSwitch from '../../../Components/CustomComponents/toggleSwitch';
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
  parentId:'',
  ParentName:'',
    formId:'',
   title:'',
   sortOrder:''
 }
export default function MenuRegistryTable(props) {
  const headers = ["Form ID","Menu Name",'Active']
  const TableVisibleItem = ["formId","title",'isActive']
  const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
const columns = [
  {
    name: 'Form ID',
    selector: row => row.formId,
    sortable: true,
    width: '20%',
  },
  {
    name: 'Menu Name',
    selector: row => row.title,
    sortable: true,
    width: '30%',
  },
//   {
//     name: 'Parent Name',
//     selector: row => row.ParentName,
//     sortable: false,
//     width: '30%',
//   },
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
  const [Menu, setMenu] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [Data, SetData] = useState([])
  const [active, setActive] = useState(true);

  useEffect(() => {
    getMenu()
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
      if (Menu.length > 0) {
        applySearchFilter(value);
      }
    }, 300)
  );

  const applySearchFilter = (search) => {
    if (Menu.length === 0) {
      return;
    }

    let data = [...Menu];
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
    dispatch({ type: 'text', name: "parentId", value: "" });
    dispatch({ type: 'text', name: "ParentName", value: "" });
        dispatch({ type: 'text', name: "formId", value: "" });
       dispatch({ type: 'text', name: "title", value: "" });
       dispatch({ type: 'text', name: "sortOrder", value: "" });
     }

  const columnsConfig = [
     {label:"Form ID", value: "formId" },
      {label:"Menu Name", value: "title" }
   ,
  //  { label: 'Active', value: 'isActive' }    
  ];

  const Validate = () => {
      if (!state.formId) {
    props.alert({ type: 'error', message: 'Please enter Form ID', show: true });
    return;
  }
     if (!state.title) {
    props.alert({ type: 'error', message: 'Please enter Menu Name', show: true });
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
      parentFormId : state.parentId ,
            formId : state.formId,
          title : state.title,
          sortOrder :  state.sortOrder
        //  isActive:active
    };
    const saveData={
          parentFormId : state.parentId ,
          formId : state.formId,
          title : state.title,
          sortOrder :  state.sortOrder
          // isActive:active
    }

    try {
      if (isEdit) {
        await updateMenu(updateData);
        props.alert({ type: 'success', message: 'Menu Updated successfully!', show: true });
      } else {
        await createMenu(saveData);
        props.alert({ type: 'success', message: 'Menu created successfully!', show: true });
      }
      clear();
      getMenu();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update Menu.' : 'Failed to create Menu.');
    }
  };

  const getMenu = async () => {
    try {
      setLoading(true);
      let url = config.Api + "Menu/getAllMenus";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to get Menu');
      }
      setLoading(false);
      const result = await response.json();
      setMenu(result)
      setFilteredData(result);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const createMenu = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Menu/createMenu";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create Menu');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const updateMenu = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "Menu/updateMenu";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to update Menu');
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
  if (name === 'ParentMenuID') {
        dispatch({ type: 'text', name: 'parentId', value: e.formId });
        dispatch({ type: 'text', name: "ParentName", value: e.title });
      }
    }
  }, []);
  const getParentList = async () => {
    try {
      let url = config.Api + "Menu/getAllParentsMenu/";
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
    dispatch({ type: 'text', name: "parentId", value: data.parentFormId ? data.parentFormId : '' });
    dispatch({ type: 'text', name: "ParentName", value: data.parentTitle ? data.parentTitle : '' });
    dispatch({ type: 'text', name: "sortOrder", value: data.sortOrder ? data.sortOrder : '' });
        dispatch({ type: 'text', name: "formId", value: data.formId ? data.formId : '' });
       dispatch({ type: 'text', name: "title", value: data.title ? data.title : '' });
     }
  const deleteRow = async (data) => {
    try {
      let url = config.Api + "Menu/deleteMenu";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete Menu');
      }

      const result = await response.json();
      getMenu();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  const handleView = (row) => {
    setViewData({"Form ID":row.formId,
                 "Menu Name":row.title,
                 "Parent":row.ParentName,
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
                  <GridContainer spacing={2} style={{width:'100%'}}>
                                          <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'38%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="formId"
                     name="formId"
                     type='text'
                     label="Menu ID"
                     value={state.formId}
                     length={10}
                     onChange={(e, value) => { storeDispatch(value, "formId", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "formId",value:""});}}
                    }
                   /> 
               </GridItem>
                                                     <GridItem xs={6} md={6} lg={6} sm={6} style={{width:'38%'}}>
                       <TextFieldCustom                    
                       mandatory={true}
                     id="title"
                     name="title"
                     type='text'
                     label="Menu Name"
                     value={state.title}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "title", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "title",value:""});}}
                    }
                   /> 
               </GridItem>
                <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'38%'}}>
                  <div>
                    <label><b>Parent Menu</b></label>
                    <DropDown
                      options={Data}
                      heading={["Parent Menu"]}
                      fieldName="Parent Menu"
                      refid={'formId'}
                      refname={["title"]}
                      Visiblefields={["title"]}
                      height="35px"
                      onChange={() => { getParentList() }}
                      getKey={(e) => { storeDispatch(e, 'ParentMenuID', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.ParentName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: 'ParentID', value: "" });
                          dispatch({ type: 'text', name: "ParentName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>
<GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'38%'}}>
                       <TextFieldCustom                    
                       mandatory={false}
                     id="sortOrder"
                     name="sortOrder"
                     type='text'
                     label="Order"
                     value={state.sortOrder}
                     length={50}
                     onChange={(e, value) => { storeDispatch(value, "sortOrder", "text") }}
                     clear={(e) => { if(e){ 
                      dispatch({type:'text',name: "sortOrder",value:""});}}
                    }
                   /> 
               </GridItem>
           
                                                </GridContainer>
                </div>
              </div>
            </div>
          </div>}
          <div className={showentry ? 'EmployeeTabelAndAddDivActive' : 'TabelAndAddDiv'} >
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
              {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => {setSearchTerm('');setFilteredData(Menu)}} /> : <FaSearch className="FaSearchdiv" />}
            </div>
          <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'Menu List'} />
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'30px'}}>
                               <StyledTooltip title={"Refresh Table"} placement="top">
                              <TbRefresh onClick={()=>{if(!searchTerm){getMenu()}}}/>
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
      // title="Menu List"
      columns={columns}
      data={filteredData}
      // data={Menu}
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