import React from "react";
import { RotatingLines } from "react-loader-spinner";
import classes from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={classes.loadingContainer}>
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="80"
        visible={true}
      />
    </div>
  );
};

export default LoadingSpinner;
