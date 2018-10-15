import React, { Fragment } from "react";
import {
  withStyles,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  IconButton
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from "@material-ui/icons/Refresh";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { green, red, yellow } from "@material-ui/core/colors";

import { TaskStatus, Task, MedullaClient } from "../libs/medulla-client";
import { TaskLogViewer } from "./TaskLogViewer";

const styles = {
  taskTitle: {
    flex: 1,
    fontWeight: 500
  },
  taskSummary: {
    paddingRight: "5rem"
  },
  taskIcons: {
    display: "flex",
    alignItems: "center"
  },
  taskAction: {
    margin: "0 2rem",
    width: "2rem",
    height: "2rem"
  }
};

type TaskStatusIconProps = {
  taskState: string;
};

const TaskStatusIcon: React.SFC<TaskStatusIconProps> = ({ taskState }) => {
  let Icon = RefreshIcon;
  let color = yellow[800];

  if (taskState === TaskStatus.complete) {
    Icon = DoneIcon;
    color = green[500];
  } else if (taskState === TaskStatus.failed) {
    Icon = ClearIcon;
    color = red[500];
  }

  return (
    <div>
      <Icon titleAccess={taskState} style={{ color }} />
    </div>
  );
};

class State {
  expanded = false;
}

type Props = {
  classes: any;
  task: Task;
};

class TaskPanel extends React.PureComponent<Props, State> {
  private readonly medullaClient = new MedullaClient();
  readonly state = new State();

  _handlePlayClick = (task: Task) => (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    this.medullaClient.postTaskStart(task);
  };

  render() {
    const { task, classes } = this.props;
    return (
      <ExpansionPanel
        key={task.name}
        onChange={(_, expanded) => this.setState({ expanded })}
        expanded={this.state.expanded}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.taskSummary}
        >
          <Typography className={classes.taskTitle}>{task.name}</Typography>
          <div className={classes.taskIcons}>
            <IconButton
              component="div"
              className={classes.taskAction}
              onClick={this._handlePlayClick(task)}
            >
              <PlayArrowIcon />
            </IconButton>
            <TaskStatusIcon taskState={task.status} />
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.taskDetails}>
          {this.state.expanded && <TaskLogViewer task={task} />}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(TaskPanel);
