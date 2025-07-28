import React from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        fontSize: '14px',
    },
}));

export default StyledTooltip;
