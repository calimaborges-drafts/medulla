import { Theme } from "@material-ui/core";

export const styles = (theme: Theme) => ({
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
