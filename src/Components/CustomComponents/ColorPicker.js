import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const ColorPickerCustom = (props) => {
  const [colorValue, setColorValue] = useState(props.value || '#000000');
console.log(colorValue,"colorValue")
  const handleChange = (e) => {
    const value = e.target.value;
    setColorValue(value);
    if (props.onChange) {
      props.onChange(e, value);
    }
  };

  const handleClear = () => {
    setColorValue('#000000');
    if (props.clear) {
      props.clear(true);
    }
  };

  useEffect(() => {
    if (props.value) {
      setColorValue(props.value);
    }
  }, [props.value]);

  return (
    <div
      className="text-field-container"
      style={{ width: props.width ? props.width : null }}
    >
      {props.label && (
        <label htmlFor={props.id}>
          <b>{props.label}</b>
        </label>
      )}
      {props.mandatory === true && <span style={{ color: 'red' }}>*</span>}
      <div className="input-wrapper" style={{border:'1px solid #d1d5db',borderRadius:'5px',height:'32px'}}>
        <input
          id={props.id}
          name={props.name}
          type="color"
          value={colorValue}
          onChange={handleChange}
          className="color-input"
          disabled={props.disabled}
          style={{ height: '35px', width: '25px', border: 'none', background: 'transparent',paddingRight:'0px',marginBottom:'0px' }}
        />
        <input
          id={props.id}
          name={props.name}
          type="text"
          value={colorValue}
          maxLength={10}
        //   onChange={handleChange}
          className="color-input"
          disabled={true}
          style={{ height: '35px', width: '100px', border: 'none', background: 'transparent',marginBottom:'0px'  }}
        />
        {props.icon && <div className="iconprops">{props.icon}</div>}
        {!props.disabled && (
          <ClearIcon
            titleAccess="Clear"
            className="FilterClearIcon"
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
};

export default ColorPickerCustom;
