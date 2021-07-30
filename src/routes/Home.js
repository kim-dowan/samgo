import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import "styles/Home.css";
import rolling from "rolling.gif";
import CreateTimeTable from "./CreateTimeTable";

const List = [];
for (var i = 1; i <= 3; i++) {
  for (var j = 1; j <= 5; j++) {
    List.push(`${i}학년 ${j}반`);
  }
}

const Home = ({ userObj }) => {
  const [init, setInit] = useState(false);
  const [sent, setSent] = useState(false);
  const [nowTime, setNowtime] = useState("");
  const [students, setStudents] = useState([]);
  const sendEmail = async () => {
    if (authService.currentUser && !authService.currentUser.emailVerified) {
      await authService.currentUser
        .sendEmailVerification()
        .then(() => {
          alert("인증 메일을 보냈습니다. 메일함을 확인해주세요!");
        })
        .catch((error) => {
          console.log(error);
          alert("이메일 보내기에 실패했습니다... 나중에 다시 시도해주세요.");
        });
    }
  };

  useEffect(() => {
    setInit(true);
    console.log(userObj);
  }, []);

  const onEmailVerify = () => {
    if (!sent) {
      sendEmail();
      setSent(true);
    } else {
      window.location.reload();
    }
  };

  const onCreateTimeTableClick = () => {
    const now = new Date();
    setNowtime(
      `${now.getFullYear()}${
        String(now.getMonth() + 1).length == 1
          ? `0${String(now.getMonth() + 1)}`
          : String(now.getMonth() + 1)
      }${
        String(now.getDate()).length == 1
          ? `0${String(now.getDate())}`
          : String(now.getDate())
      }`
    );
  };

  return (
    <>
      {init ? (
        <>
          {userObj.emailVerified ? (
            <div>
              <h1>Home</h1>
              <p>{userObj.displayName}선생님 안녕하세요!</p>
              <CreateTimeTable />
              <br />
              <button onClick={onCreateTimeTableClick}>
                오늘 시간표 추가하기
              </button>
            </div>
          ) : (
            <div>
              <h3 className="verify_warning">
                <strong>{userObj.displayName}</strong>선생님!
                <br />
                <br />
                이메일 인증 후 이용하실 수 있습니다
              </h3>
              <button onClick={onEmailVerify} className="verify_btn">
                {sent ? "이메일 인증 후 눌러주세요!" : "인증 이메일 보내기"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="loading_div">
          <img src={rolling} className="loading" width="50px" />
          <br />
          <p>잠시만 기다려주세요...</p>
        </div>
      )}
    </>
  );
};

export default Home;
