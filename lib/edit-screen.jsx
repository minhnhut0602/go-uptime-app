import React from 'react';
import Router from 'react-router';
import RSVP from 'rsvp';
import API from './api';


import './edit-screen.scss';


export default React.createClass({
  mixins: [  Router.State, Router.Navigation ],

  getInitialState: function () {
    return {
      target: {},
      tracks: []
    };
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var url = 'http://' + this.refs.url.getDOMNode().value;

    API.Target.edit({ url: url }).then(function  () {
      this.transitionTo('/');
    }.bind(this));
  },

  onDelete: function (e) {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this item?')) return false;

    API.Target.delete(this.getParams().id).then(function  () {
      this.transitionTo('/');
    }.bind(this));
  },

  componentDidMount: function() {
    var promises = RSVP.hash({
      target: API.Target.findOneById(this.getParams().id),
      tracks: API.Track.find({ targetId: this.getParams().id })
    });

    promises.then(function(result) {
      if (!this.isMounted()) return;

      result.tracks.forEach(function (track) {
        track.statusType = /^2/.test(track.status) ? 'success' : 'danger';
      });

      this.setState(result);
    }.bind(this));
  },

  render: function() {
    return <div className="edit-screen">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Edit</h3>
        </div>
        <div className="panel-body">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label for="url">URL</label>
              <input type="text" className="form-control" id="url" placeholder="Enter your URL" ref="url" value={this.state.target.url} />
            </div>
            <div className="buttons">
              <input type="submit" className="btn btn-primary" />
              <input type="button" className="btn btn-danger" value="Delete" onClick={this.onDelete} />
            </div>
          </form>

          <div className="row">
            <table className="table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>At</th>
                </tr>
              </thead>
              <tbody>
                  {this.state.tracks.map(function (track) {
                    return <tr key={track.id}>
                      <td><span className={ 'label label-' + track.statusType}>{track.status}</span></td>
                      <td>{track.createdAt}</td>
                    </tr>;
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>;
  }
});
