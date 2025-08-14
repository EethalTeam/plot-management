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
   fromEmployeeID:'',
   fromEmployeeName:'',
   toEmployeeID:'',
   toEmployeeName:''
 }
export default function TransferTable(props) {
  const [open, setOpen] = useState(false);
    const [Viewdata,setViewData] = useState({})

  const [showentry, setShowEntry] = useState('')
  const [loading, setLoading] = useState(false);
  const [hideAdd, setHideAdd] = useState(true);
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [Transfer, setTransfer] = useState([])
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

  const clear = () => {
    setIsEdit(false);
    setActive(true);
    dispatch({ type: 'text', name: '_id', value: "" });
       dispatch({ type: 'text', name: "fromEmployeeID", value: "" });
       dispatch({ type: 'text', name: "fromEmployeeName", value: "" });
       dispatch({ type: 'text', name: "toEmployeeID", value: "" });
       dispatch({ type: 'text', name: "toEmployeeName", value: "" });
     }

  const Validate = () => {
     if (!state.fromEmployeeID) {
    props.alert({ type: 'error', message: 'Please Select From Employee', show: true });
    return;
  }
       if (!state.toEmployeeID) {
    props.alert({ type: 'error', message: 'Please Select To Employee', show: true });
    return;
  }
         showAlert()
  }

  const showAlert = () => {
    Swal.fire({
      title: 'Are you sure?',
      text:'Do you really want to Transfer the follow ups?',
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
            text: 'Follow Ups transferred successfully',
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

    const saveData={
          toEmployeeID : state.toEmployeeID,
          fromEmployeeID:state.fromEmployeeID
    }

    try {
        await createTransfer(saveData);
        props.alert({ type: 'success', message: 'Transfer created successfully!', show: true });
      
      clear();
    } catch (error) {
      throw new Error(isEdit ? 'Failed to update Transfer.' : 'Failed to create Transfer.');
    }
  };

  const createTransfer = async (data) => {
    try {
      setLoading(true);
      let url = config.Api + "transferFollowUps";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error('Failed to create Transfer');
      }
      clear()
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
      if(name === 'fromEmployeeID'){
        dispatch({ type: 'text', name: "fromEmployeeID", value: e._id });
        dispatch({ type: 'text', name: "fromEmployeeName", value: e.EmployeeName });
      }
       if(name === 'toEmployeeID'){
        dispatch({ type: 'text', name: "toEmployeeID", value: e._id });
        dispatch({ type: 'text', name: "toEmployeeName", value: e.EmployeeName });
      }
    }
  }, []);
  const getEmployeeList = async () => {
    try {
        const filter={}
        if(state.fromEmployeeID){
            filter.employeeId= state.fromEmployeeID
        }else if(state.toEmployeeID){
            filter.employeeId= state.toEmployeeID
        }
      let url = config.Api + "Visitor/getAllEmployees/";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        throw new Error('Failed to get Employee');
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

  return (
    <>
    <ViewDataModal open={open} onClose={() => setOpen(false)} data={Viewdata} />
      <Loading loading={loading}>
        {/* {showentry &&  */}
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
                    {loading ? 'Transfering...' : 'Transfer'}
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
                    <p style={{color:'red'}}>* Bulk Transfer the follow up tasks from one Employee to another</p>
                  <GridContainer spacing={2}>
                <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Transfer From </b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Employee Name"]}
                      fieldName="Employee Name"
                      refid={'_id'}
                      refname={["EmployeeName"]}
                      Visiblefields={["EmployeeName"]}
                      height="35px"
                      onChange={() => { getEmployeeList() }}
                      getKey={(e) => { storeDispatch(e, 'fromEmployeeID', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.fromEmployeeName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: 'fromEmployeeID', value: "" });
                          dispatch({ type: 'text', name: "fromEmployeeName", value: "" });
                        }
                      }}
                    />
                    </div>
                    </GridItem>

                     <GridItem xs={6} md={6} lg={6} sm={6}  style={{width:'30%'}}>
                  <div>
                    <label><b>Transfer To </b></label>
                    <span style={{ color: "red" }}>*</span>
                    <DropDown
                      options={Data}
                      heading={["Employee Name"]}
                      fieldName="Employee Name"
                      refid={'_id'}
                      refname={["EmployeeName"]}
                      Visiblefields={["EmployeeName"]}
                      height="35px"
                      onChange={() => { getEmployeeList() }}
                      getKey={(e) => { storeDispatch(e, 'toEmployeeID', 'select') }}
                      totalCount={Data.length}
                      loading={true}
                      value={state.toEmployeeName}
                      clear={(e) => {
                        if (e) {
                          dispatch({ type: 'text', name: 'toEmployeeID', value: "" });
                          dispatch({ type: 'text', name: "toEmployeeName", value: "" });
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
          {/* } */}
      </Loading>
    </>
  );
}