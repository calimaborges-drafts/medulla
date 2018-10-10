import React from "react";
import { Task, MedullaClient } from "../libs/medulla-client";

type Props = {
  task: Task;
};

class State {
  log?: string;
}

export class TaskLogViewer extends React.PureComponent<Props, State> {
  readonly medullaClient = new MedullaClient();

  readonly state = new State();

  async componentDidMount() {
    const { task } = this.props;
    const log = await this.medullaClient.fetchLog(task);
    this.setState({ log });
  }

  render(): React.ReactNode {
    return <pre>{this.state.log}</pre>;
  }
}
