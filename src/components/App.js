import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService, dbService } from "fbase";
import "styles/App.css";
import rolling from "rolling.gif";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        let userData;
        const userRef = dbService.collection("teacher").doc(user.uid);
        await userRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              userData = doc.data();
              console.log(userData);
              if (userData.role === "담임선생님") {
                setUserObj({
                  uid: user.uid,
                  displayName: user.displayName,
                  emailVerified: user.emailVerified,
                  role: userData.role,
                  classNo: userData.grade + userData.classNo,
                  updateProfile: (args) => user.updateProfile(args),
                });
              } else {
                setUserObj({
                  uid: user.uid,
                  displayName: user.displayName,
                  emailVerified: user.emailVerified,
                  role: userData.role,
                  classNo: "",
                  updateProfile: (args) => user.updateProfile(args),
                });
              }
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        <div className="loading_div">
          <img src={rolling} className="loading" width="50px" />
          <br />
          <p>잠시만 기다려주세요...</p>
        </div>
      )}
    </>
  );
}

export default App;
