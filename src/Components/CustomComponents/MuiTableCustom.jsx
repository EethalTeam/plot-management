import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function MuiTableCustom(props){
  return (
    <TableContainer className="custom-table">
      <Table >
        {/* Table Header */}
        <TableHead>
          <TableRow className="custom-table-row" >
            <TableCell style={{ width: '100px',textAlign:"center" }}>
              <b>Action</b>
            </TableCell>
            {props.headers.map((header, index) => (
              <TableCell key={`header-${index}`} align={header === "Active"?"center": "left"}>
                <b>{header}</b>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {props.data && props.data.length > 0 ? (
            props.data.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`} 
              onDoubleClick={() => { 
                if (props.DoubleClickdisabled) return false; 
                // props.edit(row);
                props.expanded(true,row);
                }}>
                <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <div onClick={() => props.edit(row)}>
                      <EditIcon className='iconCommonstyle' style={{ color: '#63db63' }} />
                    </div>
                    <div className={props.Deletedisabled?'hideen':""} onClick={() => { if (props.Deletedisabled) return false;props.delete(row)}}>
                      <DeleteIcon  className='iconCommonstyle' style={{ color: '#ff0000' }} />
                    </div>
                  </div>
                </TableCell>
                {props.TableVisibleItem.map((header, colIndex) => (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`} textAlign="center">
                    {header === 'isActive' ? (
                      <div style={{ display: 'flex', justifyContent: 'center' }}><RadioButtonUncheckedIcon className='' style={{ backgroundColor: row[header] ? 'green' : 'red', borderRadius: '50%', color: row[header] ? 'green' : 'red', width: '11px', height: '11px' }} />
                      </div>) : (
                      row[header]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={props.headers.length + 1} align="center">
                <h4 className='nodataDiv'>{props.msg || 'No Records Found'}</h4>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

  );
}

