import React, { useState, useEffect, useRef } from "react";

interface ParticipantInterface {
  participant: {
    videoTracks: [];
    audioTracks: [];
    on: (action: string, callback: (track: any) => void) => void;
    removeAllListeners: () => void;
    identity: string;
  };
}

const Participant: React.FC<ParticipantInterface> = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState<any[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);

  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;

  const trackpubsToTracks = (trackMap: []) =>
    Array.from(trackMap.values())
      .map((publication: any) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track: any) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks: any[]) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks: any[]) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track: any) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks: any[]) =>
          videoTracks.filter((v) => v !== track)
        );
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks: any[]) =>
          audioTracks.filter((a) => a !== track)
        );
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={false} />
    </div>
  );
};

export default Participant;
