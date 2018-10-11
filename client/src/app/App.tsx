import React from "react";
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  CssBaseline,
  Grid,
  Typography,
  AppBar,
  Toolbar
} from "@material-ui/core";

import { Task, MedullaClient } from "./libs/medulla-client";
import { pacemaker } from "./libs/async-utils";
import { styles } from "./App.style";



const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

type Props = {
  classes: any;
};

class State {
  tasks: Task[] = [];
}

class App extends React.PureComponent<Props, State> {
  private readonly refreshInterval = 3000;
  private readonly medullaClient = new MedullaClient();
  private stopPacemaker?: () => void;

  readonly state = new State();

  async componentDidMount() {
    this.stopPacemaker = pacemaker(this.refreshInterval, async () => {
      const tasks = await this.medullaClient.fetchTasks();
      this.setState({ tasks });
    });
  }

  componentWillUnmount() {
    if (this.stopPacemaker) this.stopPacemaker();
  }

  render(): React.ReactNode {
    const { classes } = this.props;
    const { tasks } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar position="fixed">
            <Toolbar>
              <Typography
                variant="h6"
                color="inherit"
                className={classes.title}
              >
                Medulla
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid container spacing={24} className={classes.mainContent}>
            <Grid item xs={12}>
              {tasks.map(task => (
                
              ))}
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
