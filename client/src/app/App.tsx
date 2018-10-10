import React from "react";
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  CssBaseline,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Tooltip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from "@material-ui/icons/Refresh";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Task, MedullaClient, TaskStatus } from "./libs/medulla-client";
import { pacemaker } from "./libs/async-utils";
import { styles } from "./App.style";
import { green, red, yellow } from "@material-ui/core/colors";
import { TaskLogViewer } from "./components/TaskLogViewer";

type TaskStatusIconProps = {
  taskState: string;
};

const TaskStatusIcon: React.SFC<TaskStatusIconProps> = ({ taskState }) => {
  switch (taskState) {
    case TaskStatus.complete:
      return <DoneIcon titleAccess={taskState} style={{ color: green[500] }} />;
    case TaskStatus.failed:
      return <ClearIcon titleAccess={taskState} style={{ color: red[500] }} />;
    default:
      return (
        <RefreshIcon titleAccess={taskState} style={{ color: yellow[800] }} />
      );
  }
};

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
                <ExpansionPanel key={task.name}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={classes.taskSummary}
                  >
                    <Typography className={classes.taskTitle}>
                      {task.name}
                    </Typography>
                    <Tooltip title={task.status}>
                      <TaskStatusIcon taskState={task.status} />
                    </Tooltip>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <TaskLogViewer task={task} />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
