// import Grid from "@material-ui/core/Grid";
import Grid from '@mui/material/Grid';
// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";
// import withStyles from "@material-ui/core/styles/withStyles";
 
function GridItem({ ...props }) {
  const { classes, children, className, ...rest } = props;
  return (
    <Grid item  className={className+" GridItemPadding"} {...rest}>
      {children}
    </Grid>
  );
}

GridItem.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node
};

export default (GridItem);
