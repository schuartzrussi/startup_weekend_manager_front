import React from 'react';
import { createMuiTheme, responsiveFontSizes, MuiThemeProvider } from '@material-ui/core/styles';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import AdminRoute from './routes/admin_route';
import AdminPresentationRoute from './routes/admin_presentation_route';
import PublicRoute from './routes/public_route';
import UserRoute from './routes/user_route';
import SignInPage from './pages/signin';
import NotFoundPage from './pages/not_found';
import AdminHomePage from './pages/admin/home';
import AdminPitsPage from './pages/admin/pits';
import AdminUsersPage from './pages/admin/users';
import AdminTeamsPage from './pages/admin/teams';
import AdminPitRegistrationPage from './pages/admin/pit_registration';
import UserHomePage from './pages/user_home';


let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#11B22B"
    },
    secondary: {
      main: "#11B22B"
    },
  }
});

theme = responsiveFontSizes(theme);

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/entrar" component={SignInPage} />

          <AdminPresentationRoute path="/admin/pits/cadastrar" component={AdminPitRegistrationPage} />
          <AdminRoute path="/admin/pits" title="Pits" component={AdminPitsPage} />
          <AdminRoute path="/admin/usuarios" title="Usuarios" component={AdminUsersPage} />
          <AdminRoute path="/admin/times" title="Times" component={AdminTeamsPage} />
          <AdminRoute path="/admin" title="Home" component={AdminHomePage} />
          
          <UserRoute path="/" component={UserHomePage} />

          <Route component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
