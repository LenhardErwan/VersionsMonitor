import React, { Component } from "react";

import MonitorItem from "./MonitorItem.jsx";
import Model from "../Model.js";

export default class MonitorList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filtered: new Array(),
    };
  }

  filterMonitors(filter) {
    const newFiltered = new Array();
    this.props.monitors.forEach((monitor) => {
      if (monitor.name.toLowerCase().includes(filter.toLowerCase()))
        newFiltered.push(monitor);
    });
    this.setState({
      filtered: [...newFiltered],
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter != this.props.filter) {
      this.filterMonitors(this.props.filter);
    }
  }

  getMonitorList() {
    const display_grid = this.props.display_method == "grid";
    if (this.props.filter != "") {
      if (this.state.filtered.length > 0) {
        return this.state.filtered.map((monitor, key) => {
          return (
            <MonitorItem
              monitor={monitor}
              display_method={this.props.display_method}
              fctMonitor={this.props.fctMonitor}
							fctHeader={this.props.fctHeader}
              key={monitor.id}
            />
          );
        });
      } else {
        return this.props.display_method == "grid" ? (
          <p>No Results</p>
        ) : (
          <tr>
            <td colSpan="6">No Results</td>
          </tr>
        );
      }
    } else if (this.props.monitors && this.props.monitors.size > 0) {
      return Array.from(this.props.monitors.values()).map((monitor, key) => {
        return (
          <MonitorItem
            monitor={monitor}
            display_method={this.props.display_method}
            fctMonitor={this.props.fctMonitor}
						fctHeader={this.props.fctHeader}
            key={monitor.id}
          />
        );
      });
    } else {
      return this.props.display_method == "grid" ? (
        <p>No Monitors</p>
      ) : (
        <tr>
          <td colSpan="6">No Monitors</td>
        </tr>
      );
    }
  }

  render() {
    if (this.props.display_method == "grid") {
      return (
        <section className="monitor_list uk-flex uk-flex-row uk-flex-wrap">
          {this.getMonitorList()}
        </section>
      );
    } else {
      return (
        <table className="uk-table uk-table-divider uk-table-hover uk-animation-slide-right-small">
          <thead>
            <tr>
              <th className="uk-table-shrink">Icon</th>
              <th className="uk-table-expand">Name</th>
              <th>Newest version</th>
							<th>Discovery date <span className="uk-text-small">({Model.getDateFormatString()})</span></th>
              <th>Download</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.getMonitorList()}</tbody>
        </table>
      );
    }
  }
}
