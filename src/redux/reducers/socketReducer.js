const JOIN_ROOM = "JOIN_ROOM";
const LEAVE_ROOM = "LEAVE_ROOM";
const USER_JOINED = "USER_JOINED";
const USER_LEFT = "USER_LEFT";


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

const initialState = {
  roomId: null,
  usersInRoom: [],
};

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOIN_ROOM:
      return {
        ...state,
        roomId: action.payload,
        usersInRoom: [],
      };
    case LEAVE_ROOM:
      return {
        ...state,
        roomId: null,
        usersInRoom: [],
      };
    case USER_JOINED:
      return {
        ...state,
        usersInRoom: [...state.usersInRoom, action.payload],
      };
    case USER_LEFT:
      return {
        ...state,
        usersInRoom: state.usersInRoom.filter(
          (userId) => userId !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default socketReducer;
