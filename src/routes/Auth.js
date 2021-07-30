import { authService, dbService, firebaseInstance } from "fbase";
import React, { useEffect, useState } from "react";
import "styles/Auth.css";
import "styles/bootstrap.min.css";

const Auth = () => {
  const [newAccount, setNewAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [roleRadio, setRoleRadio] = useState("담임");
  const [grade, setGrade] = useState("");
  const [classNo, setClassNo] = useState("");
  //   const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const setDefaultPersistence = async () => {
    await authService
      .setPersistence(firebaseInstance.auth.Auth.Persistence.SESSION)
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setDefaultPersistence();
  }, []);

  const onChange = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "passwordChk") {
      setPasswordChk(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "roleRadio") {
      setRoleRadio(value);
    } else if (name === "grade") {
      setGrade(value);
    } else if (name === "class") {
      setClassNo(value);
    }
    // else if (name === "subject") {
    //   setSubject(value);
    // }
  };

  const errorTransfer = (err) => {
    let errorMessage;
    switch (err.code) {
      case "auth/user-not-found":
        errorMessage = "존재하지 않는 계정입니다.";
        break;
      case "auth/email-already-in-use":
        errorMessage = "해당 이메일은 이미 사용중입니다.";
        break;
      case "auth/wrong-password":
        errorMessage = "비밀번호가 틀렸습니다.";
        break;
      case "auth/too-many-requests":
        errorMessage =
          "너무 많은 요청이 발생했습니다. 나중에 다시 시도해주십시오.";
        break;
      case "auth/weak-password":
        errorMessage = "비밀번호의 최소 길이는 6자리 입니다.";
        break;
      default:
        errorMessage = `알 수 없는 에러가 발생했습니다. 에러코드 ${err.code}`;
        break;
    }
    setError(errorMessage);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newAccount) {
      if (password !== passwordChk) {
        setError("비밀번호가 일치하지 않습니다");
        return;
      } else {
        setError("");
      }
    }
    try {
      if (newAccount) {
        let userObject;
        await authService
          .createUserWithEmailAndPassword(email, password)
          .catch((err) => {
            console.log(err);
            throw err;
          });
        const user = authService.currentUser;
        if (roleRadio === "담임") {
          userObject = {
            uid: user.uid,
            name,
            email,
            grade,
            classNo,
            role: roleRadio + "선생님",
            registeredAt: new Date(),
          };
        } else {
          userObject = {
            uid: user.uid,
            name,
            email,
            role: roleRadio + "선생님",
            registeredAt: new Date(),
          };
        }
        await dbService
          .collection("teacher")
          .doc(userObject.uid)
          .set(userObject);
        await authService.currentUser
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            window.location.reload();
          });
      } else {
        await authService
          .signInWithEmailAndPassword(email, password)
          .catch((err) => {
            console.log(err);
            throw err;
          });
      }
    } catch (error) {
      console.log(error);
      errorTransfer(error);
    }
  };

  const onPersistenceClick = async (event) => {
    const {
      target: { checked },
    } = event;
    if (checked) {
      await authService.setPersistence(
        firebaseInstance.auth.Auth.Persistence.LOCAL
      );
    } else {
      await authService.setPersistence(
        firebaseInstance.auth.Auth.Persistence.SESSION
      );
    }
  };

  const toggleRegister = () =>
    setNewAccount((prev) => {
      setError("");
      return !prev;
    });

  const onFindPasswordClick = async () => {
    const email = prompt("비밀번호를 재설정할 이메일을 입력해주세요.");
    await authService
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("비밀번호 재설정 이메일을 보냈습니다! 메일함에서 확인해주세요.");
      })
      .catch((err) => {
        console.log(err);
        alert(
          "계정에 등록되지 않은 이메일이거나, 이메일을 보내는 중에 문제가 발생했습니다.\n관리자에게 문의하세요."
        );
      });
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        {newAccount ? (
          <div className="input_form">
            <h1 className="title">회원가입</h1>
            <p className="description">
              삼척고등학교 출석체크 서비스를 이용하려면 로그인이 필요합니다.
            </p>
            <input
              className="input_box"
              name="name"
              type="text"
              value={name}
              placeholder="이름"
              onChange={onChange}
              required
            />
            <br />
            <input
              className="input_box"
              name="email"
              type="email"
              value={email}
              placeholder="이메일"
              onChange={onChange}
              required
            />
            <br />
            <input
              className="input_box"
              name="password"
              type="password"
              value={password}
              placeholder="비밀번호"
              onChange={onChange}
              required
            />
            <br />
            <input
              className="input_box"
              name="passwordChk"
              type="password"
              value={passwordChk}
              placeholder="비밀번호 재입력"
              onInput={onChange}
              required
            />
            <br />
            {roleRadio === "담임" ? (
              <>
                <input
                  className="input_box"
                  name="grade"
                  type="number"
                  value={grade}
                  onChange={onChange}
                  placeholder="학년"
                  required
                />
                <input
                  className="input_box"
                  name="class"
                  type="number"
                  value={classNo}
                  onChange={onChange}
                  placeholder="반"
                  required
                />
                <br />
              </>
            ) : (
              ""
            )}
            <label htmlFor="roleRadio1" className="role_radio">
              <input
                id="roleRadio1"
                name="roleRadio"
                type="radio"
                value="담임"
                onClick={onChange}
                required
                defaultChecked={true}
              />
              <span className="caption">담임선생님</span>
            </label>
            <label htmlFor="roleRadio2" className="role_radio">
              <input
                id="roleRadio2"
                name="roleRadio"
                type="radio"
                value="교과"
                onClick={onChange}
                required
              />
              <span className="caption">교과선생님</span>
            </label>
            <label htmlFor="persistence" className="persistence">
              <input
                id="persistence"
                type="checkbox"
                onClick={onPersistenceClick}
              />{" "}
              로그인 상태 유지
            </label>
            <br />
            <p className="error">{error}</p>
            <input type="submit" value="회원가입" className="submit_btn" />
            <br />
            <span onClick={toggleRegister} className="toggle_btn">
              계정이 있다면? <strong>로그인</strong>
            </span>
            <br />
          </div>
        ) : (
          <div className="input_form">
            <h1 className="title">로그인</h1>
            <p className="description">
              삼척고등학교 출석체크 서비스를 이용하려면 로그인이 필요합니다.
            </p>
            <input
              className="input_box"
              name="email"
              type="email"
              value={email}
              placeholder="이메일을 입력하세요"
              onChange={onChange}
              required
            />
            <br />
            <input
              className="input_box"
              name="password"
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={onChange}
              required
            />
            <label htmlFor="persistence" className="persistence">
              <input
                id="persistence"
                type="checkbox"
                onClick={onPersistenceClick}
              />{" "}
              로그인 상태 유지
            </label>
            <span onClick={onFindPasswordClick} className="forgot_password">
              비밀번호 찾기
            </span>
            <br />
            <br />
            <br />
            <br />
            <p className="error">{error}</p>
            <input type="submit" value="로그인" className="submit_btn" />
            <br />
            <br />
            <span onClick={toggleRegister} className="toggle_btn">
              계정이 없으신가요? <strong>회원가입</strong>
            </span>
          </div>
        )}
        <br />
      </form>
    </div>
  );
};

export default Auth;
