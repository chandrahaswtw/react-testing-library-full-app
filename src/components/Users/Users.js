import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./User.module.css";
import LoadingSpinner from "./../LoadingSpinner/LoadingSpinner";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loadAllUsersClickHandler = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const viewPostsButtonClickHandler = (id) => {
    navigate(`/${id}`);
  };

  return (
    <div>
      <button className="outline-button" onClick={loadAllUsersClickHandler}>
        Load users
      </button>
      {loading ? (
        <LoadingSpinner></LoadingSpinner>
      ) : (
        users.map((user) => (
          <div className="group-container" key={user.id}>
            <div className="group-header">
              <label>User Id : </label>
              <span aria-label="userID">{user.id}</span>
            </div>
            <div key={user.id} className={classes.userInfoSection}>
              <label>Name</label>
              <span>{user.name}</span>
              <label>Email</label>
              <span>{user.email}</span>
            </div>
            <button
              onClick={() => viewPostsButtonClickHandler(user.id)}
              className="primary-button "
              aria-label={`see-posts-${user.id}`}
            >
              See all posts
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Users;
