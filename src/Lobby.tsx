import React from "react";

interface LobbyInterface {
  userName: string;
  roomName: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

const Lobby: React.FC<LobbyInterface> = ({
  userName,
  handleChange,
  roomName,
  handleSubmit,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2>Enter a room</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="userName"
          value={userName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="room">Room name:</label>
        <input
          type="text"
          name="roomName"
          value={roomName}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default Lobby;
