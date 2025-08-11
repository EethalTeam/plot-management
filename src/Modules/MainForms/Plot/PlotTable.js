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
   facing:'',
   unitId:'',
   UnitName:''
 }
export default function PlotTable(props) {
  const headers = ["Plot Code","Unit",'Active']
  const TableVisibleItem = ["plotCode","UnitName",'isActive']
  const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})
const columns = [
  {
    name: 'Unit',
    selector: row => row.unitId.UnitName,
    sortable: true,
    width: '15%',
  },
   {
    name: 'Plot Number',
    selector: row => row.plotNumber,
    sortable: true,
    width: '15%',
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
   {
    name: 'Landmark',
    selector: row => row.landmark,
    sortable: true,
    width: '14%',
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
    dispatch({ type: 'text', name: '_id', value: data._id ? data._id : '' });
        dispatch({ type: 'text', name: "plotCode", value: data.plotCode ? data.plotCode : '' });
        dispatch({ type: 'text', name: "unitId", value: data.unitId ? data.unitId : '' });
       dispatch({ type: 'text', name: "UnitName", value: data.UnitName ? data.UnitName : '' });
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
  const handleView = (row) => {
    setViewData({"Plot Code":row.plotCode,
                 "Unit":row.UnitName,
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