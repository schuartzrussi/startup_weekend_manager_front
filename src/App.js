import React from 'react';
import { createMuiTheme, responsiveFontSizes, MuiThemeProvider } from '@material-ui/core/styles';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import AdminRoute from './routes/admin_route';
import PublicRoute from './routes/public_route';
import SignInPage from './pages/signin';
import NotFoundPage from './pages/not_found';
import AdminHomePage from './pages/admin/home';


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
          <PublicRoute path="/sign-in" component={SignInPage} />
          <AdminRoute path="/admin" title="Home" component={AdminHomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
