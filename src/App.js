import React from "react";
import Users from "./components/Users/Users";
import Posts from "./components/Posts/Posts";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import classes from "./App.module.css";

const App = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className={classes.routeContainer}>
        <Routes>
          <Route path="/" element={<Users />}></Route>
          <Route path="/:id" element={<Posts />}></Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
