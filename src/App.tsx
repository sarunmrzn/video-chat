import React, { useState } from "react";
import axios from "axios";

import Lobby from "./Lobby";
import Room from "./Room";

const App = () => {
  const [state, setState] = useState<{
    userName: string;
    roomName: string;
    token: string | null;
  }>({
    userName: "",
    roomName: "",
    token: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <>
      {state.token ? (
        <Room
          roomName={state.roomName}
          token={state.token}
          handleLogout={() =>
            setState({
              userName: "",
              roomName: "",
              token: null,
            })
          }
        />
      ) : (
        <Lobby
          userName={state.userName}
          roomName={state.roomName}
          handleChange={handleChange}
          handleSubmit={() => {
            axios
              .get(`${process.env.REACT_APP_API_URL}/getToken`, {
                params: { userName: state.userName, room: state.roomName },
              })
              .then((res) => {
                setState({ ...state, token: res?.data });
              })
              .catch((err) => console.error(err));
          }}
        />
      )}
    </>
  );
};

export default App;
