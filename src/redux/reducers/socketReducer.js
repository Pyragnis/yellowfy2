// Action types
const JOIN_ROOM = "JOIN_ROOM";
const LEAVE_ROOM = "LEAVE_ROOM";
const USER_JOINED = "USER_JOINED";
const USER_LEFT = "USER_LEFT";
const PLAY = "PLAY";
const PAUSE = "PAUSE";
const CHANGE_TRACK = "CHANGE_TRACK";
const SEEK = "SEEK";
const UPDATE_PLAYER_STATE = "UPDATE_PLAYER_STATE";
const SET_ROOM_ID = "SET_ROOM_ID"; // New action type
const CLEAR_ROOM_ID = "CLEAR_ROOM_ID"; // New action type

// Action creators
export const joinRoom = (roomId) => ({
  type: JOIN_ROOM,
  payload: roomId,
});

export const leaveRoom = () => ({
  type: LEAVE_ROOM,
});

export const userJoined = (userId) => ({
  type: USER_JOINED,
  payload: userId,
});

export const userLeft = (userId) => ({
  type: USER_LEFT,
  payload: userId,
});

export const play = () => ({
  type: PLAY,
});

export const pause = () => ({
  type: PAUSE,
});

export const changeTrack = (trackId) => ({
  type: CHANGE_TRACK,
  payload: trackId,
});

export const seek = (time) => ({
  type: SEEK,
  payload: time,
});

export const updatePlayerState = (playerState) => ({
  type: UPDATE_PLAYER_STATE,
  payload: playerState,
});

// New action creators for managing room ID
export const setRoomId = (roomId) => ({
  type: SET_ROOM_ID,
  payload: roomId,
});

export const clearRoomId = () => ({
  type: CLEAR_ROOM_ID,
});

const initialState = {
  roomId: null,
  usersInRoom: [],
  playerState: {
    isPlaying: false,
    currentTrack: null,
    seekTime: 0,
  },
};

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOIN_ROOM:
      return {
        ...state,
        roomId: action.payload,
        usersInRoom: [],
        playerState: initialState.playerState,
      };
    case LEAVE_ROOM:
      return {
        ...state,
        roomId: null,
        usersInRoom: [],
        playerState: initialState.playerState,
      };
    case USER_JOINED:
      return {
        ...state,
        usersInRoom: [...state.usersInRoom, action.payload],
      };
    case USER_LEFT:
      return {
        ...state,
        usersInRoom: state.usersInRoom.filter((userId) => userId !== action.payload),
      };
    case PLAY:
      return {
        ...state,
        playerState: { ...state.playerState, isPlaying: true },
      };
    case PAUSE:
      return {
        ...state,
        playerState: { ...state.playerState, isPlaying: false },
      };
    case CHANGE_TRACK:
      return {
        ...state,
        playerState: { ...state.playerState, currentTrack: action.payload },
      };
    case SEEK:
      return {
        ...state,
        playerState: { ...state.playerState, seekTime: action.payload },
      };
    case UPDATE_PLAYER_STATE:
      return {
        ...state,
        playerState: { ...action.payload },
      };
    // New cases for handling room ID
    case SET_ROOM_ID:
      return {
        ...state,
        roomId: action.payload,
      };
    case CLEAR_ROOM_ID:
      return {
        ...state,
        roomId: null,
      };
    default:
      return state;
  }
};

export default socketReducer;
