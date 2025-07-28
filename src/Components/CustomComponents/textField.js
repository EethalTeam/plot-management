import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const TextFieldCustom = (props) => {
  const [inputValue, setInputValue] = useState(props.value || (props.type === 'text' ? '' : 0));
  const handleInputChange = (e) => {
    let value = e.target.value;

    if (props.label && props.label.toLowerCase().includes("quantity")) {
    // Remove any non-numeric characters
      value = value.replace(/[^0-9]/g, '');
    }
     if (props.type === 'number') {
    // Allow only digits
    value = value.replace(/\D/g, '');

    // Enforce max length
    if (props.length && value.length > props.length) {
      value = value.slice(0, props.length);
    }
  }

    setInputValue(value);

    if (props.onChange) {
      props.onChange(e, value);  
    }
  };
useEffect(()=>{
setInputValue(props.value)
},[props.value])
  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="text-field-container" style={{width:`${props.width ? props.width : null}`, }}>
      {props.label && <label htmlFor={props.id}><b>{props.label}</b></label>}
      {props.mandatory === true ? <span style={{ color: "red" }}>*</span> : null}
      <div className="input-wrapper">
        <input
          id={props.id}
          name={props.name}
          type={props.type}
          value={inputValue || (props.type === 'text' ? '' : 0)}
          maxLength={Number(props.length)}
          onChange={handleInputChange}
          placeholder={props.placeholder ?props.placeholder : null || props.label?`Enter ${props.label}`:null}
          className={props.icon ? "inputDiv input-wrapperinput":"inputDiv input-wrappernoinput"}
          disabled={props.disabled}
        />
         {props.icon ? <div className='iconprops'>{props.icon}</div>:null}
        {(inputValue && !props.disabled)? (
          <ClearIcon title="clear" className="FilterClearIcon" onClick={()=>{handleClear(); 
            if (props.clear) {
              props.clear(true) 
            }
           }} />
        ) : ''}
      </div>
    </div>
  );
};

export default TextFieldCustom;
