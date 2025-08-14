import React, { useState } from "react";
import { Tooltip, Button, Stack } from "@mui/material";
import { FcLikePlaceholder } from "react-icons/fc";
import { FaEye } from "react-icons/fa";
import DropDown from '../../../Components/CustomComponents/DataList'

const PlotSeatView = ({ plots, handleView ,handleAddVisitor, state, dispatch, storeDispatch, getUnitList, Data}) => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  // Extract unique status names
  let statuses=[...new Set(plots.map(p => p?.statusId?.statusName))]
  const uniqueStatuses = [{filter:"All",filtercount:plots.length}, ...statuses.map((val)=>plots.filter((p)=>p.statusId.statusName === val).reduce((acc,curr)=>{return {filter:curr.statusId.statusName,filtercount:acc.filtercount+=1,colorcode:curr.statusId.colorCode}},{filter:'',filtercount:0,colorcode:''}))];
  // Filtered plots based on selectedStatus
  const filteredPlots =
    selectedStatus === "All"
      ? plots
      : plots.filter(p => p?.statusId?.statusName === selectedStatus);

let clickTimeout = null;

const handleClick = (row) => {
  if (clickTimeout !== null) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
    handleAddVisitor(row); // double-click
  } else {
    clickTimeout = setTimeout(() => {
      handleView(row); // single click
      clickTimeout = null;
    }, 250); // 250ms delay to distinguish
  }
};


  return (
    <div>
      {/* Filter Buttons */}
      <Stack direction="row" spacing={2} padding={2} flexWrap="wrap" style={{display:'flex',justifyContent:'space-between'}}>
        <div style={{width:'60%',display:'flex',gap:'10px'}}>
        {uniqueStatuses.map((status) => (
          <Button
            key={status.filter}
            style={{backgroundColor:status.colorcode || '#1976d2',color:'white'}}
            // variant={selectedStatus === status.filter ? "contained" : "outlined"}
            onClick={() => setSelectedStatus(status.filter)}
          >
            {selectedStatus === status.filter ? <b>{status.filter}({status.filtercount})</b>:<span>{status.filter}({status.filtercount})</span> }
          </Button>
        ))}
        </div>
           <div>
                    {/* <label><b>Status</b></label>
                    <span style={{ color: "red" }}>*</span> */}
                    <DropDown
                      options={Data}
                      heading={["Unit"]}
                      fieldName="Unit"
                      refid={'_Id'}
                      refname={["UnitName"]}
                      Visiblefields={["UnitName"]}
                      NoToolTip={true}
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
      </Stack>

      {/* Plots Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "3px",
          height:'auto',
          overflow:'auto'
        }}
      >
        {filteredPlots.length > 0 ? (
          filteredPlots.map((plot) => (
            <Tooltip
              title={
                <>
                  <div>
                    <strong>Plot Code:</strong> {plot.plotCode}
                  </div>
                  <div>
                    <strong>Unit:</strong> {plot.unitId?.UnitName}
                  </div>
                  <div>
                    <strong>Area:</strong> {plot.areaInSqFt} sq.ft
                  </div>
                  <div>
                    <strong>Status:</strong> {plot?.statusId?.statusName}
                  </div>
                </>
              }
              arrow
              key={plot._id}
            >
              <div
                style={{
                  backgroundColor: plot.statusId?.colorCode || "#ccc",
                  width: "70px",
                  height: "75px",
                  // display: "flex",
                  // alignItems: "center",
                  // justifyContent: "center",
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                }}
                onClick={() => handleClick(plot)}
              >
                <div style={{width:'100%',
                display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height:'15px',
                  paddingRight:'5px',
                  paddingLeft:'5px',
                  paddingTop:'5px'
                  }}>
                    <FaEye />
                   <FcLikePlaceholder />
                   </div>
                  <div style={{width:'100%',
                display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height:'13px',
                  paddingRight:'8px',
                  paddingLeft:'8px',
                  paddingTop:'7px'
                  }}>
                     <b>{plot.visitDetails.length}</b>
                      <b>{plot.interestDetails.length}</b></div>
                <h3 style={{width:'100%', 
                margin: 0,
                display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                   }}>{plot.plotNumber}</h3>
              </div>
            </Tooltip>
          ))
        ) : (
          <div style={{ padding: "20px" }}>No plots found for selected status.</div>
        )}
      </div>
    </div>
  );
};

export default PlotSeatView;
