import { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const TextFieldCustom = (props) => {
  const [inputValue, setInputValue] = useState(props.value || (props.type === 'text' ? '' : 0));
const handleInputChange = (e) => {
  let value = e.target.value;

  if (props.label && props.label.toLowerCase().includes("quantity")) {
    if (props.Decimals) {
      // Allow numbers with optional one dot for decimal
      value = value.replace(/[^0-9.]/g, '');

      // Prevent multiple dots
      const parts = value.split('.');
      if (parts.length > 2) {
        parts.splice(2); // remove extras
        value = parts.join('.');
      }
    } else {
      // Only digits
      value = value.replace(/\D/g, '');
    }
  }

  if (props.type === 'number') {
    if (props.Decimals) {
      // Same logic as above
      value = value.replace(/[^0-9.]/g, '');
      const parts = value.split('.');
      if (parts.length > 2) {
        parts.splice(2);
        value = parts.join('.');
      }
    } else {
      value = value.replace(/\D/g, '');
    }

    // Enforce max length on whole number part
    const wholePart = value.split('.')[0];
    if (props.length && wholePart.length > props.length) {
      const decimalPart = value.includes('.') ? '.' + (value.split('.')[1] || '') : '';
      value = wholePart.slice(0, props.length) + decimalPart;
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
          value={inputValue || ((props.type === 'text' || props.Phone || props.type === 'email') ? '' : 0)}
          maxLength={Number(props.length)}
          onChange={handleInputChange}
          step={props.Decimals ? "0.01" : "1"}
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
