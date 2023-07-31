import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./User.module.css";
import LoadingSpinner from "./../LoadingSpinner/LoadingSpinner";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const buttonClickHandler = (id) => {
    navigate(`/${id}`);
  };

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div>
      {users.map((user) => (
        <div className="group-container">
          <div className="group-header">
            <label htmlFor="userId">User Id : </label>
            <span id="userId">{user.id}</span>
          </div>
          <div key={user.id} className={classes.userInfoSection}>
            <label htmlFor="userName">Name</label>
            <span id="userName">{user.name}</span>
            <label htmlFor="userEmail">Email</label>
            <span is="userEmail">{user.email}</span>
          </div>
          <button
            onClick={buttonClickHandler.bind(this, user.id)}
            className="primary-button "
          >
            See all posts
          </button>
        </div>
      ))}
    </div>
  );
};

export default Users;
