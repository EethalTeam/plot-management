import React, { useState, useRef, useEffect } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { BiSolidDownArrow ,BiSolidUpArrow } from "react-icons/bi";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import LinearProgress from '@mui/material/LinearProgress';
const ProjectDataList = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [scrollHt, setScrollHt] = useState(0);
  const [filterIndex, setFilterIndex] = useState(1);
  const [justSelected, setJustSelected] = useState(false);
  const inputRef = useRef(null);
  const datalistRef = useRef(null);
  const divRef = useRef(null);

  useEffect(() => {
    if (props.inputSelected) {
      props.inputSelected(inputValue, props.refname);
    }
    if(props.value){
      setInputValue(props.value)
    }
  }, [inputValue, props]);

  useEffect(() => {
    if (Array.isArray(props.options)) {
      setFilteredOptions((prevdata) => [...prevdata, ...props.options]);
    } else {
      console.error("props.options is not an array");
    }
  }, [props.options]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    filterOptions(value);
  };

  const filterOptions = (value) => {
    if (value) {
      const filtered = props.options?.filter(
        (option) =>
          option[props.refname[0]] &&
          option[props.refname[0]].toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else if (Array.isArray(props.options)) {
      setFilteredOptions((prevdata) => [...prevdata, ...props.options]);
    }
    setIsOpen(true);
  };

  const handleFocus = () => {
    filterOptions(inputValue);
    if (props.onChange) {
      props.onChange(filterIndex, inputValue);
    }
    setScrollHt(0);
    setFilterIndex(1);
    setFilteredOptions([]);
  };

  const handleClickAway = () => {
    setIsOpen(false);
    setScrollHt(0);
    setFilterIndex(1);
  };

  const handleOptionClick = (option) => {
    setJustSelected(true);
    props.getKey(option);
    setInputValue(option[props.refname[0]]);
    setIsOpen(false)
  };

  const handleKeyDown = (e) => {
    if (!filteredOptions || filteredOptions.length === 0) return;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "Enter":
        if (selectedIndex !== -1) {
          handleOptionClick(filteredOptions[selectedIndex]);
        }
        break;
    }
  };

  const clear = () => {
    setInputValue("");
    setFilteredOptions(props.options);
    props.clear(true);
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    setScrollHt(clientHeight);
    if (scrollHeight - scrollTop === scrollHt) {
      setFilterIndex((prev) => prev + 1);
      // props.onChange(filterIndex + 1, inputValue);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!justSelected) {
        // setIsOpen(false);
      }
      setJustSelected(false);
    }, 200);
  };
  

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div ref={datalistRef} style={{ position: "relative", width: props.width || "100%" ,height:props.height || '30px'}}>
        <input
          className="inputDiv"
          type="text"
          style={{fontWeight:'bolder'}}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
          placeholder={props.fieldName ? `Select ${props.fieldName}` : ""}
          required
        />
        <div>
          {/* {inputValue ? (
            <ClearIcon title="clear" className="FilterClearIcon" onClick={clear} />
          ) : */}
           
            {props.options && !isOpen ?<BiSolidDownArrow className="FilterdownIcon" />:<BiSolidUpArrow className="FilterdownIcon" />
            }
        </div>
        {props.options && isOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              zIndex: 9,
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
             {props.loading && (!props.options || props.options.length === 0) && <LinearProgress />}
            <div style={{ maxHeight: "133px", overflowY: "auto" }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option[props.refid]}
                    onClick={() => handleOptionClick(option)}
                    className="DropdownDiv"
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {props.Visiblefields.map((field) => (
                      <div key={field}>{option[field]}</div>
                    ))}
                  </div>
                ))
              ) : (
                <div style={{ padding: "8px", color: "#888" }}>
                    {/* No Records */}
                    </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default ProjectDataList;
