import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ROUTES } from '../../constants/routes';

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: ROUTES.LOGIN, state: { from: props.location } }} />
        )
      }
    />
  );
}

export default PrivateRoute;
