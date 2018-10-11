import React from "react";
import {
  withStyles,
  Typography,
  Tooltip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from "@material-ui/icons/Refresh";
import { green, red, yellow } from "@material-ui/core/colors";

import { TaskStatus, Task } from "../libs/medulla-client";
import { TaskLogViewer } from "./TaskLogViewer";

const styles = {
  taskTitle: {
    flex: 1,
    fontWeight: 500
  },
  taskSummary: {
    paddingRight: "5rem"
  }
};

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

type Props = {
  classes: any;
  task: Task;
};

class TaskPanel extends React.PureComponent<Props> {
  render() {
    const { task, classes } = this.props;
    return (
      <ExpansionPanel key={task.name}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.taskSummary}
        >
          <Typography className={classes.taskTitle}>{task.name}</Typography>
          <Tooltip title={task.status}>
            <TaskStatusIcon taskState={task.status} />
          </Tooltip>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TaskLogViewer task={task} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(TaskPanel);
