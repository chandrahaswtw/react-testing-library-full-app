import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./../LoadingSpinner/LoadingSpinner";

const Posts = (props) => {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backButtonClickHandler = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPostInfo(data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div>
      <button className="outline-button" onClick={backButtonClickHandler}>
        Go back
      </button>
      {postInfo.map((post) => (
        <div className="group-container" key={post.id}>
          <div className="group-header">
            <label htmlFor="postTitle">Post title : </label>
            <span id="postTitle">{post.title}</span>
          </div>
          <div className={classes.postInfoSection}>
            <label htmlFor="userName">User Id: </label>
            <span id="userName">{post.userId}</span>
            <label htmlFor="userEmail">Body: </label>
            <span is="userEmail">{post.body}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
