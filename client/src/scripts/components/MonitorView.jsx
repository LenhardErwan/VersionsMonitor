import React, { Component } from "react";

import * as Toastr from "toastr";
import { Img } from "react-image";

import noImage from "../../images/no_image.svg";
import Model from "../Model";

const toastr_options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "10000",
  extendedTimeOut: "2000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

export default class MonitorView extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleDeleteVersion = this.handleDeleteVersion.bind(this);
    this.getVersionsRender = this.getVersionsRender.bind(this);
    this.handleRefresh = this.props.handleRefresh;
  }

  async handleDeleteVersion(id) {
    try {
      const res = await Model.deleteVersion(id);
      this.props.reload(this.props.id);
      Toastr.success(
        `Version \"${res.deleted.value}\" has been deleted`,
        "Version deleted",
        toastr_options
      );
    } catch (err) {
      console.error(err);
      Toastr.error(err.msg, "Error when deleting version", toastr_options);
    }
  }

  getVersionsRender() {
    if (this.props.versions.length > 0) {
      return this.props.versions.map((version) => {
        return (
          <tr key={version.id}>
            <td>{version.value}</td>
            <td>{new Date(version.discovery_timestamp).toLocaleString()}</td>
            <td>
              <button
                className="uk-button icon-button"
                uk-toggle={`target: #delete-version-${version.id}`}
                uk-tooltip="title: Delete version"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
              <div
                id={`delete-version-${version.id}`}
                className="uk-flex-top"
                uk-modal="stack: true"
              >
                <div className="uk-modal-dialog uk-margin-auto-vertical">
                  <div className="uk-modal-header">
                    <h4 className="uk-modal-title">
                      Are you sure to delete this version ?
                    </h4>
                    <button
                      className="uk-modal-close-default"
                      type="button"
                      uk-close="true"
                    ></button>
                  </div>
                  <div className="uk-modal-body">
                    <p>
                      Be careful if you delete this item there will be no way to
                      go back.
                    </p>
                  </div>
                  <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close">
                      Cancel
                    </button>
                    <button
                      className="uk-button uk-button-danger uk-modal-close"
                      onClick={() => {this.handleDeleteVersion(version.id)}}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan="3">No versions</td>
        </tr>
      );
    }
  }

  render() {
    return (
      <article className="uk-modal-dialog uk-margin-auto-vertical">
        <div className="uk-modal-header">
          <h2>
						View Monitor - 
            <Img src={[this.props.image, `${new URL(this.props.url).origin}/favicon.ico`, noImage]} />
            {this.props.name}
          </h2>
          <button
            className="uk-modal-close-default"
            type="button"
            uk-close="true"
          ></button>
        </div>
        <div className="uk-modal-body">
          <div>
            <span>Name: </span>
            <span>{this.props.name}</span>
          </div>
          <div>
            <a href={this.props.url}>Link</a>
          </div>
          <div>
            <button className="uk-button icon-button" onClick={this.handleRefresh}>
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
          <fieldset>
            <legend>Versions</legend>
            <table className="uk-table uk-table-divider uk-table-hover">
              <thead>
                <tr>
                  <th>version number</th>
                  <th className="uk-table-expand">discovery date</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr className="loading">
                  <td colSpan="3">Loading....</td>
                </tr>
                {this.getVersionsRender()}
              </tbody>
            </table>
          </fieldset>
        </div>
        <div className="uk-modal-footer uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close">
            Close
          </button>
        </div>
      </article>
    );
  }
}
