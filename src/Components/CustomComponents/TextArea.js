import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const TextareaCustom = (props) => {
  const [inputValue, setInputValue] = useState(props.value || '');

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Quantity validation
    if (props.label && props.label.toLowerCase().includes("quantity")) {
      if (props.Decimals) {
        value = value.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
          parts.splice(2);
          value = parts.join('.');
        }
      } else {
        value = value.replace(/\D/g, '');
      }
    }

    // Number type validation
    if (props.type === 'number') {
      if (props.Decimals) {
        value = value.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
          parts.splice(2);
          value = parts.join('.');
        }
      } else {
        value = value.replace(/\D/g, '');
      }

      // Limit length for whole number part
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

  useEffect(() => {
    setInputValue(props.value || '');
  }, [props.value]);

  const handleClear = () => {
    setInputValue('');
    if (props.clear) {
      props.clear(true);
    }
  };

  return (
    <div className="text-field-container" style={{ width: props.width ? props.width : null }}>
      {props.label && <label htmlFor={props.id}><b>{props.label}</b></label>}
      {props.mandatory === true ? <span style={{ color: "red" }}>*</span> : null}
      <div className="input-wrapper">
        <textarea
          id={props.id}
          name={props.name}
          value={inputValue}
          maxLength={Number(props.length)}
          onChange={handleInputChange}
          placeholder={props.placeholder ? props.placeholder : (props.label ? `Enter ${props.label}` : '')}
          className={props.icon ? "inputDiv input-wrapperinput" : "inputDiv input-wrappernoinput"}
          disabled={props.disabled}
          rows={props.rows || 3}
          style={{ resize: props.resize || 'vertical' }}
        />
        {props.icon ? <div className='iconprops'>{props.icon}</div> : null}
        {(inputValue && !props.disabled) ? (
          <ClearIcon
            title="clear"
            className="FilterClearIcon"
            onClick={handleClear}
          />
        ) : ''}
      </div>
    </div>
  );
};

export default TextareaCustom;
