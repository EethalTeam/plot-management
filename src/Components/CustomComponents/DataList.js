import { useState, useRef, useEffect } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { BiSolidDownArrow ,BiSolidUpArrow } from "react-icons/bi";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import LinearProgress from '@mui/material/LinearProgress';
import StyledTooltip from '../CustomComponents/Tooltip'

const ProjectDataList = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [fieldinput,setfieldinput] = useState("")
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [scrollHt, setScrollHt] = useState(0);
  const [filterIndex, setFilterIndex] = useState(1);
  const [justSelected, setJustSelected] = useState(false);
  const inputRef = useRef(null);
  const datalistRef = useRef(null);
  const divRef = useRef(null);
   const pageRef = useRef(1);
   const limit=50;

  useEffect(() => {
    if (props.inputSelected) {
      props.inputSelected(inputValue, props.refname);
    }
    if(props.value){
      setInputValue(props.value)
    }else{
      setInputValue('')
    }
    // if(inputValue && props.FilterOptions){
    //  props.FilterOptions(inputValue || fieldinput)
    // }
  }, [inputValue, props]);

  useEffect(() => {
    if (Array.isArray(props.options)) {
      setFilteredOptions((prevdata) => [
        // ...prevdata,
         ...props.options]);
    } else {
      console.error("props.options is not an array");
    }
  }, [props.options]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setfieldinput(value)
    setInputValue(value);
   props.FilterOptions ? props.FilterOptions(value,pageRef.current,limit) : filterOptions(value);
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
      setFilteredOptions((prevdata) => [
        // ...prevdata,
         ...props.options]);
    }
    setIsOpen(true);
  };

  const handleFocus = () => {
    
    // if(props.value){
   props.FilterOptions ? props.FilterOptions(inputValue,pageRef.current,limit) : filterOptions(inputValue);
    setIsOpen(true)
    // }else{
    //   filterOptions(inputValue);
    // }
    if (props.onChange) {
      props.onChange(filterIndex, inputValue);
    }
    setScrollHt(0);
    setFilterIndex(1);
    // setFilteredOptions([]);
  };

  const handleClickAway = () => {
    if(!props.value){
      setInputValue('')
      setfieldinput('')
    }
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
      case "Backspace":
        props.clear(true)
        break;
    }
  };

  const clear = () => {
    setInputValue("");
    setfieldinput('')
    props.FilterOptions ? props.FilterOptions('',pageRef.current,limit) : setFilteredOptions(props.options);
    // setFilteredOptions(props.options);
    props.clear(true);
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    setScrollHt(clientHeight);
    if (scrollHeight - scrollTop === scrollHt) {
      setFilterIndex((prev) => prev + 1);
      // props.onChange(filterIndex + 1, inputValue);
    }
     const isBottom = scrollTop + clientHeight >= scrollHeight - 20;

    if (isBottom) {
      props.FilterOptions ? props.FilterOptions(fieldinput,pageRef.current,limit) : setFilteredOptions(props.options);
      pageRef.current += 1;
    }

  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!justSelected) {
        // setIsOpen(false);
      }
      setJustSelected(false);
      pageRef.current = 1;
      if(props.Blur){
      props.Blur(true)
    }
    }, 200);
  };
  

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        ref={datalistRef}
        style={{
          position: "relative",
          width: props.width ||"100%",
          height: props.height || "",
          marginTop: props.marginTop || "",
          marginBottom: props.marginBottom || "",
          borderStyle: props.borderStyle || "",
        }}
      >
        <StyledTooltip title={inputValue} placement="top">
        <input
          className="inputDiv"
          type="text"
          value={inputValue || fieldinput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
          placeholder={props.fieldName ? `Select ${props.fieldName}` : ""}
          required
          disabled={props.disabled}
        />
        </StyledTooltip>
        <div>
          {(inputValue && !props.disabled) ? (
            <ClearIcon title="clear" className="FilterClearIcon" onClick={clear} />
          ) : (
            props.options && !isOpen ?<BiSolidDownArrow className="FilterdownIcon" />:<BiSolidUpArrow className="FilterdownIcon" />)}
        </div>
        {props.options && isOpen && (
          // Dropdown Main
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
              height: "181px",
              overflowY: "auto",
            }}
          >
            {/* DropDown Header */}
            {props.loading && (!props.options || props.options.length === 0) && <LinearProgress />}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: props.Visiblefields.length > 1  ? "1fr 1fr" : "2fr",
                justifyContent: "space-evenly",
                background: "rgb(25, 118, 210)",
                fontSize: "12px",
                fontWeight: "bold",
                height: "23px",
                color:"#fff",
                paddingLeft:'7px'
              }}
            >
              {props.heading?.map((e, index) => (
                <div key={index}>{e}</div>
              ))}
            </div>
             {/* DropDown Body */}
            <div style={{height:"133px",overflowY: "auto",}}
              onScroll={handleScroll}
              ref={divRef}
            >
              {filteredOptions && filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                    <div  key={index} onClick={() => {handleOptionClick(option)}} className="DropdownDiv" style={{ cursor: "pointer",  display: "grid", justifyContent: "space-evenly", height:"25px",gridTemplateColumns:props.Visiblefields.length > 1  ? "1fr 1fr" : "2fr",borderBottom: "1px solid rgb(221 221 221 / 34%)",paddingLeft:'7px'}}>
                      {props.Visiblefields.map((e, i) => 
                       { return !props.NoToolTip ? (<StyledTooltip title={option[e]} placement="top">
                          <div key={i} className="optionStyle">
                            {option[e]}
                            </div>
                            </StyledTooltip>):(<div key={i} className="optionStyle">
                            {option[e]}
                            </div>)}
                      )}
                    </div>
                ))
              ) : (
                <div style={{ padding: "8px", color: "#888" }}>No Records</div>
              )}
            </div>
             {/* DropDown Footer */}
            {props.options && props.options.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: " rgb(25, 118, 210)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color:"#fff",
                  height: "23px",
                  cursor:'pointer',
                  textDecoration:'underline'
                }}
              >
                <span>
                  {props.options.length === 0
                    ? "No Records"
                    : props.options.length === props.totalCount
                    ? "Showing all Records"
                    : "Showing "}
                  {props.options.length > 0 &&
                    `(${filteredOptions.length}/${props.totalCount})`}
                </span>
                {props.createEasy ?  <span onClick={()=>{props.openAddPopUp(true)}}>
                Add {props.fieldName}
                </span> : '' }
              </div>
            )}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default ProjectDataList;
