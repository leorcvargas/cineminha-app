import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5422e5',
      light: '#9054ff',
      dark: '#0000b1',
    },
    secondary: {
      main: '#19857b',
      light: '#55b5aa',
      dark: '#00574f',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#040407',
      paper: '#212121',
    },
  },
});

export default theme;
