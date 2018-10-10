import React, { Fragment } from "react";
import {
  withStyles,
  CssBaseline,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Theme,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Tooltip
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Task, MedullaClient } from "./libs/medulla-client";
import { pacemaker } from "./libs/async-utils";

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1
  },
  title: {
    grow: 1
  },
  mainContent: {
    marginTop: theme.spacing.unit * 7,
    padding: theme.spacing.unit * 2
  }
});

type TaskStatusIconProps = {
  taskState: string;
};

const TaskStatusIcon: React.SFC<TaskStatusIconProps> = ({ taskState }) => {
  switch (taskState) {
    case "complete":
      return <DoneIcon titleAccess={taskState} />;
    case "failed":
      return <ClearIcon titleAccess={taskState} />;
    default:
      return <RefreshIcon titleAccess={taskState} />;
  }
};

type Props = {
  classes: any;
};

class State {
  tasks: Task[] = [];
}

class App extends React.PureComponent<Props, State> {
  private readonly medullaClient = new MedullaClient();
  private stopPacemaker?: () => void;

  readonly state = new State();

  async componentDidMount() {
    this.stopPacemaker = pacemaker(1000, async () => {
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
      <Fragment>
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
              <Paper>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tarefas</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map(task => (
                      <TableRow key={task.name}>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>
                          <Tooltip title={task.status}>
                            <TaskStatusIcon taskState={task.status} />
                          </Tooltip>
                        </TableCell>
                        <TableCell>RUN</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(App);
