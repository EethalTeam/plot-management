import React, { useEffect, useState } from "react";
import { TextField, Box, Typography } from "@mui/material";

const DimensionInput = (props) => {
  const [dimensions, setDimensions] = useState({ lenth: "", width: "", height: "" });
  const [val, setval] = useState({});
  useEffect(() => {
    if (props.onChange) {
      props.onChange(dimensions);
    }
  }, [dimensions])
  useEffect(() => {
    if (props.onChange) {
      props.onChange(val);
    }
  }, [val])
  useEffect(() => {
    if(props.value !== 'undefinedXundefinedXundefined' && props.Fields.length > 1 && props.value.length > 1){
      let values = (props.value || '').split('X')
      if ((values[0] !== undefined && values[0].length > 0) || (values[1] !== undefined && values[1].length > 0) || (values[2] !== undefined && values[2].length > 0)) {
        setDimensions({ lenth: values[0], width: values[1], height: values[2] })
      }
    }else if(props.Fields.length === 1 && props.value){
      let values = props.value
      if (values !== undefined) {
        setDimensions({ lenth: values, width: '', height: '' })
      }
    }
  }, [props.value])
  const handleChange = (field, value) => {
    setDimensions({ ...dimensions, [field]: value });
    setval({...val,[field]:value})
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      border="1px solid #ccc"
      borderRadius={2}
      padding="0px"
      width="100%"
      gap={props.gap?props.gap:1}
      justifyContent={"space-between"}
    >
      {props.Fields.map((field, index) => (
        <Box key={field} display="flex" alignItems="center">
          <TextField
            variant="standard"
            size="small"
            type="number"
            value={dimensions[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            InputProps={{
              disableUnderline: true,
              inputProps: { style: { appearance: 'textfield' } },
            }}
            sx={{
              width: props.width?props.width:50,
              "& input": { textAlign: props.textAlign?props.textAlign:"center", padding: "4px 4px" },
              '& input[type=number]': {
                MozAppearance: 'textfield',
                WebkitAppearance: 'none',
                appearance: 'none',
                '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              },
            }}
          />
          {(props.Fields.length !=1 && index < 2) && (
            <Typography variant="h6" mx={1} color="#d1d1d1">
              ×
            </Typography>
          )}
        </Box>
      ))}
      {props.DropDown}
    </Box>
  );
};

export default DimensionInput;
