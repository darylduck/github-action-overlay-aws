import { useEffect, useState } from "react";
import Sound from 'react-sound';

import useWebSocket from "react-use-websocket";

import BuildStatusLogo from "./components/BuildStatus/BuildStatus";
import {
  SOCKET_URL,
  DISPLAY_DURATION,
  BUILD_SUCCESS_IMAGE_URL,
  BUILD_FAILURE_IMAGE_URL,
  BUILD_IMAGE_WIDTH,
  BUILD_IMAGE_HEIGHT,
  SHOULD_PLAY_SOUND,
  SUCCESS_SOUND,
  FAILURE_SOUND
} from './config';

function App() {  
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState<{ success: boolean }>();

  const onMessage = async (message: any) => {    
    setMessage(JSON.parse(message.data));
    setShowMessage(true);
  };

  useWebSocket(SOCKET_URL, {
    onMessage: onMessage
  });

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
      }, DISPLAY_DURATION);
    }
  }, [showMessage]);

  let sound = null;

  if (SHOULD_PLAY_SOUND) {
    const soundUrl = message?.success ? SUCCESS_SOUND : FAILURE_SOUND;

    if (soundUrl) {
      sound = <Sound url={soundUrl} playStatus="PLAYING" />;
    }    
  }

  const buildLogoUrl = message?.success ? BUILD_SUCCESS_IMAGE_URL : BUILD_FAILURE_IMAGE_URL;  

  return showMessage ? (
    <>
      {sound}
      <BuildStatusLogo 
        animationDuration={Math.ceil(DISPLAY_DURATION * 0.8)}
        buildLogoUrl={buildLogoUrl}
        width={BUILD_IMAGE_WIDTH}
        height={BUILD_IMAGE_HEIGHT} />
    </>
  ) : null;
}

export default App;
