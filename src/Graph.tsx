import React, { Component } from "react";
import { Table, TableData } from "@finos/perspective";
import { ServerRespond, Thresholds } from "./Streamers";
import { DataManipulator } from "./DataManipulator";
import "./Graph.css";

interface IProps {
  data: ServerRespond[];
  thresholds: Thresholds;
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement("perspective-viewer");
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = (document.getElementsByTagName(
      "perspective-viewer"
    )[0] as unknown) as PerspectiveViewerElement;

    const schema = {
      price_abc: "float",
      price_def: "float",
      ratio: "float",
      timestamp: "date",
      trigger_alert: "float",
      up_threshold: "float",
      low_threshold: "float",
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute("view", "y_line");
      elem.setAttribute("row-pivots", '["timestamp"]');
      elem.setAttribute(
        "columns",
        '["ratio", "up_threshold", "low_threshold", "trigger_alert"]'
      );
      elem.setAttribute(
        "aggregates",
        JSON.stringify({
          price_abc: "avg",
          price_def: "avg",
          ratio: "avg",
          timestamp: "distinct count",
          trigger_alert: "avg",
          up_threshold: "avg",
          low_threshold: "avg",
        })
      );
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(([
        DataManipulator.generateRow(this.props.data, this.props.thresholds),
      ] as unknown) as TableData);
    }
  }
}

export default Graph;
