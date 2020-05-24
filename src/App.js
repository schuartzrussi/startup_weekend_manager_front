import React from 'react';
import { createMuiTheme, responsiveFontSizes, MuiThemeProvider } from '@material-ui/core/styles';
import LoginPage from './pages/login';


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
      <div className="App"> 
        <LoginPage />
    </div>
    </MuiThemeProvider>
  );
}

export default App;
