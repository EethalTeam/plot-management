import { useState } from 'react';
import { utils, writeFile } from 'xlsx';
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { MdPictureAsPdf } from "react-icons/md";
import { Button, Menu, MenuItem, IconButton } from '@mui/material';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import StyledTooltip from '../../Components/CustomComponents/Tooltip';

const ExportTable = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const exportToExcel = () => {
    if(props.tableData.length ===0){
      props.alert({ type: 'error', message: 'No data to export', show: true });
      return
    }
    if(props.BulkExecute){
      props.Execute(props.tableData)
    }
    const worksheetData = props.tableData.map((row) => {
      const rowData = {};
      props.columnConfig.forEach((col) => {
        rowData[col.label] = row[col.value];
      });
      return rowData;
    });

    const worksheet = utils.json_to_sheet(worksheetData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    writeFile(workbook, `${props.fileName}.xlsx`);
    handleClose();
  };

  const exportToPDF = () => {
        if(props.tableData.length ===0){
      props.alert({ type: 'error', message: 'No data to export', show: true });
      return
    }
    if(props.BulkExecute){
      props.Execute(props.tableData)
    }
    const doc = new jsPDF();

    const headers = props.columnConfig.map(col => col.label);
    const data = props.tableData.map(row =>
      props.columnConfig.map(col => row[col.value])
    );

    autoTable(doc, {
      head: [headers],
      body: data,
    });

    doc.save(`${props.fileName}.pdf`);
    handleClose();
  };

  return (
    <div>
      <StyledTooltip title="Export" placement="top">
        <div className='ExcelExportButton'>
          <IconButton onClick={handleClick}>
            <PiMicrosoftExcelLogo style={{ width: "22px", height: "22px" }} />
          </IconButton>
        </div>
      </StyledTooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={exportToExcel}>
          <PiMicrosoftExcelLogo style={{ marginRight: 8 }} /> Export to Excel
        </MenuItem>
        <MenuItem onClick={exportToPDF}>
          <MdPictureAsPdf style={{ marginRight: 8 }} /> Export to PDF
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ExportTable;
