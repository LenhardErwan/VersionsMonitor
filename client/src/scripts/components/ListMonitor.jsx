import React, { Component } from "react";
import * as Toastr from "toastr";
import Monitor from "./Monitor.jsx";

export default class ListMonitor extends Component {
  constructor(props) {
    super(props);

    this.state = {
			filtered: new Array()
		};
	}

	filterMonitors(filter) {
		const newFiltered = new Array();
		this.props.monitors.forEach((monitor) => {
			if(monitor.name.toLowerCase().includes(filter.toLowerCase())) newFiltered.push(monitor);
		})
		this.setState({
      filtered: [...newFiltered]
    });
	}

	componentDidUpdate(prevProps) {
		if(prevProps.filter != this.props.filter) {
			this.filterMonitors(this.props.filter);
		}
	}

  render() {
		if(this.props.filter != "") {
			if(this.state.filtered.length > 0) {
				return (
					<section className="monitor_list uk-flex uk-flex-row uk-flex-wrap">
						{this.state.filtered.map((monitor, key) => {
								return (
									<Monitor params={monitor} deleteMonitor={this.props.deleteMonitor} editMonitor={this.props.editMonitor} saveMonitors={this.props.saveMonitors}  key={monitor.hash} />
								);
						})}
					</section>
				);
			}
			else {
				return (
					<section className="monitor_list uk-flex uk-flex-row uk-flex-wrap">
						<p>No Results</p>
					</section>
				);
			}
			
		}
		else if(this.props.monitors && this.props.monitors.size > 0) {
			return (
				<section className="monitor_list uk-flex uk-flex-row uk-flex-wrap">
					{Array.from(this.props.monitors.values()).map((monitor, key) => {
							return (
								<Monitor params={monitor} deleteMonitor={this.props.deleteMonitor} editMonitor={this.props.editMonitor} saveMonitors={this.props.saveMonitors}  key={monitor.hash} />
							);
					})}
				</section>
			);
		}
    else if(this.props.monitors && this.props.monitors.size <= 0) {
			return (
				<section className="monitor_list uk-flex uk-flex-row uk-flex-wrap">
					<p>No monitors</p>
				</section>
			);
		}
		else {
			return null
		}
  }
}
