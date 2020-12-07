import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";

interface RoomInterface {
  roomName: string;
  token: string;
  handleLogout: () => void;
}

const Room: React.FC<RoomInterface> = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState<any | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const participantConnected = (participant: any) => {
      setParticipants([...participants, participant]);
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      console.log(room);
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", (removedParticipant: any) =>
        setParticipants(
          participants.filter((p: any) => p !== removedParticipant)
        )
      );
      room.participants.forEach(participantConnected);
    });

    return () => {
      if (room?.localParticipant.state === "connected") {
        room.localParticipant.tracks.forEach(function (trackPublication: any) {
          trackPublication.track.stop();
        });
        room.disconnect();

        return setRoom(null);
      }
      return setRoom(room);
    };
    // eslint-disable-next-line
  }, [roomName, token]);

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button
        onClick={async () => {
          await room.disconnect();
          await setRoom(null);
          handleLogout();
        }}
      >
        Log out
      </button>
      <div className="local-participant">
        {room && (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">
        {participants.map((participant: any) => (
          <Participant key={participant.sid} participant={participant} />
        ))}
      </div>
    </div>
  );
};

export default Room;
