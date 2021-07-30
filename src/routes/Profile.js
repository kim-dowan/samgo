import { authService } from "fbase";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj }) => {
  const history = useHistory();
  useEffect(() => {
    console.log(authService.currentUser);
    if (!authService.currentUser) {
      history.push("/");
    }
  }, []);

  const onLogOutClick = async () => {
    await authService.signOut().then(history.push("/"));
  };
  return <button onClick={onLogOutClick}>로그아웃</button>;
};

export default Profile;
