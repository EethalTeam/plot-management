import { useState, useRef, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import LinearProgress from "@mui/material/LinearProgress";
import StyledTooltip from "../CustomComponents/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";

const ProjectMultiSelect = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [fieldinput, setfieldinput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [scrollHt, setScrollHt] = useState(0);
  const [filterIndex, setFilterIndex] = useState(1);
  const [justSelected, setJustSelected] = useState(false);

  const inputRef = useRef(null);
  const datalistRef = useRef(null);
  const divRef = useRef(null);
  const pageRef = useRef(1);
  const limit = 50;

  useEffect(() => {
    if (props.value && Array.isArray(props.value)) {
      setSelectedItems(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (Array.isArray(props.options)) {
      setFilteredOptions([...props.options]);
    } else {
      console.error("props.options is not an array");
    }
  }, [props.options]);

  useEffect(()=>{
    let selectedOptions=[]
if(selectedItems.length > 0){
selectedItems.map(val=>{
  selectedOptions.push({[props.refid]:val[props.refid],[props.refname]:val[props.refname]})
})
props.getKey(selectedOptions)
}else{
  props.getKey(selectedOptions)
}
  },[selectedItems])

  const handleInputChange = (e) => {
    const value = e.target.value;
    setfieldinput(value);
    setInputValue(value);
    props.FilterOptions
      ? props.FilterOptions(value, pageRef.current, limit)
      : filterOptions(value);
  };

  const filterOptions = (value) => {
    if (value) {
      const filtered = props.options?.filter(
        (option) =>
          option[props.refname[0]] &&
          option[props.refname[0]].toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([...props.options]);
    }
    setIsOpen(true);
  };

  const handleFocus = () => {
    props.FilterOptions
      ? props.FilterOptions(inputValue, pageRef.current, limit)
      : filterOptions(inputValue);
    setIsOpen(true);
    setScrollHt(0);
    setFilterIndex(1);
    if (props.onChange) {
      props.onChange(filterIndex, inputValue);
    }
  };

  const handleClickAway = () => {
    setIsOpen(false);
    setScrollHt(0);
    setFilterIndex(1);
  };

  const handleOptionToggle = (option) => {
    setJustSelected(true);
    let updated;
    const exists = selectedItems.some(
      (item) => item[props.refname[0]] === option[props.refname[0]]
    );
    if (exists) {
      updated = selectedItems.filter(
        (item) => item[props.refname[0]] !== option[props.refname[0]]
      );
    } else {
      updated = [...selectedItems, option];
    }
    setSelectedItems(updated);
    props.onSelect && props.onSelect(updated);
  };

  const clearAll = () => {
    setSelectedItems([]);
    props.onSelect && props.onSelect([]);
  };

  const handleRemoveChip = (option) => {
    const updated = selectedItems.filter(
      (item) => item[props.refname[0]] !== option[props.refname[0]]
    );
    setSelectedItems(updated);
    props.onSelect && props.onSelect(updated);
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    setScrollHt(clientHeight);
    const isBottom = scrollTop + clientHeight >= scrollHeight - 20;
    if (isBottom) {
      props.FilterOptions
        ? props.FilterOptions(fieldinput, pageRef.current, limit)
        : setFilteredOptions(props.options);
      pageRef.current += 1;
    }
  };

  const isSelected = (option) => {
    return selectedItems.some(
      (item) => item[props.refname[0]] === option[props.refname[0]]
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        ref={datalistRef}
        style={{
          position: "relative",
          width: props.width || "100%",
          marginTop: props.marginTop || "",
          marginBottom: props.marginBottom || "",
        }}
      >
        {/* Pills + Input field */}
        <StyledTooltip
          title={selectedItems.map((i) => i[props.refname[0]]).join(", ")}
          placement="top"
        >
          <div
            className="inputDiv"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "4px",
              padding: "4px",
              cursor: props.disabled ? "not-allowed" : "text",
              border:'1px solid #ccc',
              borderRadius:'4px',
              height:'35px'
            }}
            onClick={() => !props.disabled && inputRef.current?.focus()}
          >
            {selectedItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#e3f2fd",
                  borderRadius: "12px",
                  padding: "2px 6px",
                  marginBottom:'19px',
                  fontSize: "12px"
                }}
              >
                {item[props.refname[0]]}
                <CloseIcon
                  style={{
                    fontSize: "14px",
                    marginLeft: "4px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChip(item);
                  }}
                />
              </div>
            ))}
            <input
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                minWidth: "60px",
              }}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              ref={inputRef}
              placeholder={
                selectedItems.length === 0
                  ? props.fieldName
                    ? `Select ${props.fieldName}`
                    : "Select options..."
                  : ""
              }
              disabled={props.disabled}
            />
          </div>
        </StyledTooltip>

        {/* Icons */}
        <div>
          {selectedItems.length > 0 && !props.disabled ? (
            <ClearIcon
              title="Clear All"
              className="FilterClearIcon"
              onClick={clearAll}
            />
          ) : isOpen ? (
            <BiSolidUpArrow className="FilterdownIcon" />
          ) : (
            <BiSolidDownArrow className="FilterdownIcon" />
          )}
        </div>

        {/* Dropdown */}
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
              height: "190px",
              overflowY: "auto",
            }}
          >
            {props.loading &&
              (!props.options || props.options.length === 0) && <LinearProgress />}

            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "200px " + (props.Visiblefields.length > 1 ? "1fr 1fr" : "2fr"),
                background: "rgb(25, 118, 210)",
                fontSize: "12px",
                fontWeight: "bold",
                height: "30px",
                color: "#fff",
                paddingLeft: "7px",
                alignItems: "center",
              }}
            >
              {/* <div></div> */}
              {props.heading?.map((e, index) => (
                <div key={index}>{e}</div>
              ))}
            </div>

            {/* Options */}
            <div
              style={{ height: "133px", overflowY: "auto" }}
              onScroll={handleScroll}
              ref={divRef}
            >
              {filteredOptions && filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const selected = isSelected(option);
                  return (
                    <div
                      key={index}
                      onClick={() => handleOptionToggle(option)}
                      className="DropdownDiv"
                      style={{
                        cursor: "pointer",
                        display: "grid",
                        gridTemplateColumns:
                          "40px " +
                          (props.Visiblefields.length > 1 ? "1fr 1fr" : "2fr"),
                        borderBottom: "1px solid rgb(221 221 221 / 34%)",
                        paddingLeft: "7px",
                        background: selected ? "#e3f2fd" : "transparent",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        checked={selected}
                        tabIndex={-1}
                        disableRipple
                        onChange={() => handleOptionToggle(option)}
                      />
                      {props.Visiblefields.map((e, i) =>
                        !props.NoToolTip ? (
                          <StyledTooltip
                            title={option[e]}
                            placement="top"
                            key={i}
                          >
                            <div className="optionStyle">{option[e]}</div>
                          </StyledTooltip>
                        ) : (
                          <div key={i} className="optionStyle">
                            {option[e]}
                          </div>
                        )
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "8px", color: "#888" }}>No Records</div>
              )}
            </div>

            {/* Footer */}
            {props.options && props.options.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "rgb(25, 118, 210)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#fff",
                  height: "23px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  alignItems: "center",
                  padding: "0 5px",
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
                {props.createEasy ? (
                  <span onClick={() => props.openAddPopUp(true)}>
                    Add {props.fieldName}
                  </span>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default ProjectMultiSelect;
