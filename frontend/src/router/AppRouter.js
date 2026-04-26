import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import PrivateRoute from '../shared/components/PrivateRoute';

import { LoginPage, RegisterPage } from '../features/auth';
import { HomePage } from '../features/home';
import { ClientsPage, ClientMaintenancePage } from '../features/clients';
import { NotFoundPage } from '../features/error_pages';

function AppRouter() {
  return (
    <Switch>
      {/* Public routes */}
      <Route exact path="/" render={() => <Redirect to={ROUTES.LOGIN} />} />
      <Route exact path={ROUTES.LOGIN} component={LoginPage} />
      <Route exact path={ROUTES.REGISTER} component={RegisterPage} />

      {/* Protected routes */}
      <PrivateRoute exact path={ROUTES.HOME} component={HomePage} />
      <PrivateRoute exact path={ROUTES.CLIENTS} component={ClientsPage} />
      <PrivateRoute exact path={ROUTES.CLIENT_MAINTENANCE} component={ClientMaintenancePage} />
      <PrivateRoute exact path={ROUTES.CLIENT_EDIT} component={ClientMaintenancePage} />

      {/* 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default AppRouter;
