import React from 'react';
import { createMuiTheme, responsiveFontSizes, MuiThemeProvider } from '@material-ui/core/styles';
import { Switch, BrowserRouter } from 'react-router-dom';
import SignInPage from './pages/signin';
import HomePage from './pages/home';
import PrivateRoute from './routes/private_route';
import PublicRoute from './routes/public_route';


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
          <PrivateRoute path="/" component={HomePage} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
