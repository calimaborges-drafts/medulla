import React from "react";
import {
  Typography,
  AppBar,
  Toolbar,
  withStyles,
  Paper,
  Theme,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody
} from "@material-ui/core";

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1
  },
  title: {
    grow: 1
  },
  listWrapper: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  }
});

// TODO: Usar algo como workspaces para reutilizar esse código
enum TaskStatus {
  complete = "complete",
  preparing = "preparing",
  starting = "starting",
  running = "running",
  notCreated = "not_created",
  failed = "failed"
}

interface Task {
  name: string;
  status: TaskStatus;
}

type Props = {
  classes: any;
};

type State = {
  tasks: Task[];
};

class App extends React.Component<Props, State> {
  state = {
    tasks: []
  };

  render() {
    const { classes } = this.props;
    const { tasks } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.title}>
              Medulla
            </Typography>
          </Toolbar>
          <Paper className={classes.listWrapper}>
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
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(App);
