import React, { useState, useEffect } from "react";
import "../../Assets/styles/ToggleSwitch.css";

function ToggleSwitch(props) {
    const [isToggled, setIsToggled] = useState(props.checked);
    useEffect(() => {
        setIsToggled(props.checked)
    }, [props.checked])

    return (
        <label className="toggle-switch">
            <input type="checkbox"
                checked={isToggled}
                onChange={(e) => { setIsToggled(e.target.checked); props.onChange(e) }}
                frmctrlid={props.frmctrlid}
                frmctrlidname={props.frmctrlidname}
                fieldorder={props.fieldorder}
                disabled={props.disabled}
                tfLabel={props.tfLabel} />
            <span className="switch" />
        </label>
    );
}
export default ToggleSwitch;