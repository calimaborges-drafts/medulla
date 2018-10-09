import React, { Fragment } from "react";
import {
  withStyles,
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
  CssBaseline
} from "@material-ui/core";
import { Task, MedullaClient } from "./libs/medulla-client";

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

type Props = {
  classes: any;
};

class State {
  tasks: Task[] = [];
}

class App extends React.PureComponent<Props, State> {
  readonly state = new State();
  readonly medullaClient = new MedullaClient();

  async componentDidMount() {
    const tasks = await this.medullaClient.fetchTasks();
    this.setState({ tasks });
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
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map(task => (
                      <TableRow key={task.name}>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>{task.status}</TableCell>
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
