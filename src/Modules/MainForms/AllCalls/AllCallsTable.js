import { useState, useCallback, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Loading from '../../../Components/CustomComponents/Loading';
import { FaSearch } from "react-icons/fa";
import ClearIcon from '@mui/icons-material/Clear';
import { config } from '../../../Components/CustomComponents/config';
import ExportTableToExcel from "../../../Components/CustomComponents/ExportTableToExcel";
import GridContainer from '../../../Components/CustomComponents/GridContainer';
import GridItem from '../../../Components/CustomComponents/GridItem';
import DataTable from 'react-data-table-component';
import '../../../Assets/app.css';
import { TbRefresh } from "react-icons/tb";
import StyledTooltip from '../../../Components/CustomComponents/Tooltip';

// --- Helper Functions for Formatting ---
const formatTimestamp = (ms) => {
  if (!ms) return 'N/A';
  return new Date(ms).toLocaleString();
};

const formatDuration = (sec) => {
  if (!sec || sec === 0) return '0:00';
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


export default function CallLogTable(props) {
  
  // --- Columns for Call Logs ---
  const columns = [
    {
      name: 'Direction',
      selector: row => row.direction,
      sortable: true,
    },
    {
      name: 'From',
      selector: row => row.from,
      sortable: true,
    },
    // {
    //   name: 'To',
    //   selector: row => row.to,
    //   sortable: true,
    // },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Date & Time',
      selector: row => row.time,
      cell: row => formatTimestamp(row.time),
      sortable: true,
    },
    {
      name: 'Total Duration',
      selector: row => row.duration,
      cell: row => formatDuration(row.duration),
      sortable: true,
    },
    {
      name: 'Recording',
      cell: row => (
        row.recordingUrl ? (
          <audio
            controls
            preload="none"
            src={row.recordingUrl}
            style={{ width: '250px' }}
          >
            Your browser does not support the audio element.
          </audio>
        ) : (
          'N/A'
        )
      ),
      width: '300px',
    },
  ];

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allLogs, setAllLogs] = useState([]); // Holds all logs from API
  const [activeTab, setActiveTab] = useState('All'); // State for tabs

  const tabs = [
    'All',
    'Answered In',
    'Missed In',
    'Answered Out',
    'Missed Out',
  ];

  // --- Fetch Call Logs ---
  const getCallLogs = useCallback(async () => {
    try {
      setLoading(true);
            let url = config.Api + "calls/fetch-all";
            const response = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch call logs');
      }
      setLoading(false);
      const result = await response.json();
      
      if (result.success) {
        setAllLogs(result.calls); // Store in the main log state
        setFilteredData(result.calls); // Initially, filtered data is all data
      } else {
        throw new Error(result.message || 'Failed to fetch call logs');
      }

    } catch (error) {
      console.error('Error:', error);
      props.alert({ type: 'error', message: error.message, show: true });
      setLoading(false);
    }
  }, [props]); // Added props to dependency array

  useEffect(() => {
    getCallLogs();
  }, [getCallLogs]); // Runs on component mount

  // --- Search and Filter Logic ---

  // Debounce function from your component
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Search handler from your component
  const handleSearchChange = (
    debounce((value) => {
      setSearchTerm(value);
      // We no longer call applySearchFilter here
      // The useMemo hook will handle it
    }, 300)
  );

  // This useMemo hook replaces applySearchFilter and runs when dependencies change
  useEffect(() => {
    let filtered = [...allLogs];

    // 1. Filter by Active Tab
    switch (activeTab) {
      case 'Answered In':
        filtered = filtered.filter(
          log => log.direction === 'Inbound' && log.status === 'Answered'
        );
        break;
      case 'Missed In':
        filtered = filtered.filter(
          log => log.direction === 'Inbound' && log.status !== 'Answered'
        );
        break;
      case 'Answered Out':
        filtered = filtered.filter(
          log => log.direction === 'Outbound' && log.status === 'Answered'
        );
        break;
      case 'Missed Out':
        filtered = filtered.filter(
          log => log.direction === 'Outbound' && log.status !== 'Answered'
        );
        break;
      case 'All':
      default:
        // No tab filter needed
        break;
    }

    // 2. Filter by Search Term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        Object.values(log).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredData(filtered);
  }, [allLogs, activeTab, searchTerm]);


  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        fontSize: '16px',
      },
    },
  };

  // --- Excel Export Config ---
  const columnsConfig = [
    { label: "Direction", value: "direction" },
    { label: "From", value: "from" },
    { label: "To", value: "to" },
    { label: "Status", value: "status" },
    { label: "Date & Time", value: (row) => formatTimestamp(row.time) },
    { label: "Duration (sec)", value: "duration" },
    { label: "Recording URL", value: "recordingUrl" },
  ];

  return (
    <>
      <Loading loading={loading}>
        {props.alert?.show && (
          <Stack className='Stackstyle' spacing={2}>
            <Alert severity={props.alert.type} onClose={() => props.alert({ ...props.alert, show: false })}>
              <AlertTitle>{props.alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
              {props.alert.message}
            </Alert>
          </Stack>
        )}
        
        {/* --- Tab Buttons --- */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'contained' : 'outlined'}
              onClick={() => setActiveTab(tab)}
              className='ButtonStyle' // Use your existing button style
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* --- Table and Search Bar (from your layout) --- */}
        {/* We use TabelAndAddDiv just for layout, no 'Add' button */}
        <div className={'TabelAndAddDiv'}>
          <div className='AddbtnDivMain'>
            <div className='badgesection'>
            </div>
            <div className='leftsideContent'>
              <div style={{ display: 'flex', width: '275px', justifyContent: 'space-between' }}>
                <div className="WeeklyTaskSeacrhInput">
                  <input
                    type="text"
                    id="searchTableInput"
                    placeholder="Search here"
                    className="form-control form-control-sm WeeklyTaskSerFil"
                    value={searchTerm}
                    onChange={(Event) => {
                      setSearchTerm(Event.target.value);
                      handleSearchChange(Event.target.value);
                    }}
                  />
                  {searchTerm ? <ClearIcon title="clear" className="FilterClearIcon" onClick={() => { setSearchTerm(''); }} /> : <FaSearch className="FaSearchdiv" />}
                </div>
                <ExportTableToExcel tableData={filteredData} columnConfig={columnsConfig} fileName={'Call Logs'} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30px' }}>
                  <StyledTooltip title={"Refresh Table"} placement="top">
                    <TbRefresh onClick={() => { if (!searchTerm) { getCallLogs() } }} style={{cursor:'pointer'}} />
                  </StyledTooltip>
                </div>
              </div>
            </div>
          </div>
          <DataTable
            // title="Call Logs"
            columns={columns}
            data={filteredData}
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