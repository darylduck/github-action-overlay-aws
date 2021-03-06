export const WEBSOCKET_SCHEME = process.env.REACT_APP_WEBSOCKET_SCHEME || 'ws';
export const WEBSOCKET_DOMAIN = process.env.REACT_APP_WEBSOCKET_DOMAIN || 'localhost';
export const WEBSOCKET_PORT = process.env.REACT_APP_WEBSOCKET_PORT;
export const SOCKET_URL = `${WEBSOCKET_SCHEME}://${WEBSOCKET_DOMAIN}${WEBSOCKET_PORT ? `:${WEBSOCKET_PORT}`: ''}`;
export const DISPLAY_DURATION = 10000;
export const BUILD_SUCCESS_IMAGE_URL = process.env.REACT_APP_SUCCESS_IMAGE_URL || '';
export const BUILD_FAILURE_IMAGE_URL = process.env.REACT_APP_FAILURE_IMAGE_URL || '';
export const BUILD_IMAGE_WIDTH = parseInt(process.env.REACT_APP_BUILD_IMAGE_WIDTH_IN_PIXELS || '100');
export const BUILD_IMAGE_HEIGHT = parseInt(process.env.REACT_APP_BUILD_IMAGE_HEIGHT_IN_PIXELS || '100');
export const SHOULD_PLAY_SOUND = process.env.REACT_APP_SHOULD_PLAY_SOUND ? Boolean(process.env.REACT_APP_SHOULD_PLAY_SOUND) : false;
export const SUCCESS_SOUND = process.env.REACT_APP_SUCCESS_SOUND;
export const FAILURE_SOUND = process.env.REACT_APP_FAILURE_SOUND;