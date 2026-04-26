import React, { createContext, useReducer, useEffect } from 'react';

// ── State shape ─────────────────────────────────────────────────────────────
const initialState = {
  token: null,
  userId: null,
  username: null,
  isAuthenticated: false,
};

// ── Action types ─────────────────────────────────────────────────────────────
export const AUTH_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        username: action.payload.username,
        isAuthenticated: true,
      };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
export const AuthContext = createContext(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate session on mount
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    if (token && userId && username) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN,
        payload: { token, userId, username },
      });
    }
  }, []);

  const login = ({ token, userid, username, expiration }) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', userid);
    sessionStorage.setItem('username', username);
    // "Recuérdame" — persist username in localStorage if opted in
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (rememberMe) {
      localStorage.setItem('savedUsername', username);
    }
    dispatch({
      type: AUTH_ACTIONS.LOGIN,
      payload: { token, userId: userid, username },
    });
  };

  const logout = () => {
    sessionStorage.clear();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
