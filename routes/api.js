'use strict';

module.exports = function (app) {
  //Config Monoose & Set up Issue Schema
  //Set versionkey to false for remove unnessary fields while return
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI);
  const Schema = mongoose.Schema;
  const issueSchema = new Schema({
    issue_title: { type: String, required:true },
    issue_text: { type: String, required:true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String },
    open: { type: Boolean, required: true},
    status_text: { type: String},
    project_name: { type: String, required: true }
  }, { versionKey: false })
  
  let Issue = mongoose.model('Issue', issueSchema);

  app.use(function(req, res, next) {
    console.log(req);
    next();
  });

  app.route('/api/issues/:project')
  
    //Search
    .get(function (req, res){
      let project = req.params.project;
      //Get the parameters
      let _id = req.query._id;
      let issue_title = req.query.issue_title;
      let issue_text = req.query.issue_text;
      let created_on = req.query.created_on;
      let updated_on = req.query.updated_on;
      let created_by = req.query.created_by;
      let assigned_to = req.query.assigned_to;
      let open = req.query.open;
      let status_text = req.query.status_text;
      
      let query = {
        project_name: project
      };

      //Optional parameters
      if (_id) {
        query._id = _id;
      }
      if (issue_title) {
        query.issue_title = issue_title;
      }
      if (issue_text) {
        query.issue_text = issue_text;
      }
      if (open) {
        query.open = open;
      }
      if (created_on) {
        query.created_on = created_on;
      }
      if (updated_on) {
        query.updated_on = updated_on;
      }
      if (created_by) {
        query.created_by = created_by;
      }
      if (assigned_to) {
        query.assigned_to = assigned_to;
      }
      if (status_text) {
        query.status_text = status_text;
      }
      
      //Execute Search
      Issue.find(query)
      .select({ project_name: 0 })
      .exec(function(err, data){
          if (err) return console.error(err);
          res.json(data)
      });
    })
    
    //Create Issue
    .post(function (req, res){
      let project = req.params.project;
      let current_date = new Date();
      let newIssue = new Issue({
        project_name: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: current_date,
        updated_on: current_date,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to ? req.body.assigned_to : "",
        status_text: req.body.status_text ? req.body.status_text : "",
        open: true
      });
      
      if (!newIssue.issue_title || !newIssue.issue_text || !newIssue.created_by)
      {
        res.json({ error: "required field(s) missing"});
        return;        
      }

      newIssue.save(function(err, data) {
        if (err) return console.log(err);
        res.json(data);
      })
    })
    
    //Update Issue
    .put(function (req, res){
      let project = req.params.project;
      let _id = req.body._id;

      //Return Error while id is not provided
      if (!_id)
      {
        res.json({ error: "missing _id"});
        return;
      }

      //Return Error while id is not valid object id
      if (!mongoose.Types.ObjectId.isValid(_id))
      {
        res.json({ error: "could not update", _id: _id});
        return;
      }

      //Set up update field
      let update = {};
      if (req.body.issue_title)
      {
        update.issue_title = req.body.issue_title;
      }
      if (req.body.issue_text)
      {
        update.issue_text = req.body.issue_text;
      }
      if (req.body.created_by)
      {
        update.created_by = req.body.created_by;
      }
      if (req.body.assigned_to)
      {
        update.assigned_to = req.body.assigned_to;
      }
      if (req.body.status_text)
      {
        update.status_text = req.body.status_text;
      }
      if (req.body.open)
      {
        update.open = req.body.open;
      }

      //Return Error while no update field is provided
      if (Object.keys(update).length === 0)
      {
        res.json({ error: "no update field(s) sent", _id: _id});
        return;
      }
      else {
        update.updated_on = new Date();
      }
      //find & update
      Issue.findByIdAndUpdate(mongoose.Types.ObjectId(_id), update, { new: true }, function(err, data) {
        if (err) 
        {
          console.error(err)
          res.json({ error: "could not update", _id: _id});
        }
        if (data)
        {
          res.json({ result: "successfully updated", _id: _id});
        } else
        {
          res.json({ error: "could not update", _id: _id});
        }
      })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let _id = req.body._id;
      //Return Error while id is not provided
      if (!_id)
      {
        res.json({ error: "missing _id"});
        return;
      }

      //Return Error while id is not valid object id
      if (!mongoose.Types.ObjectId.isValid(_id))
      {
        res.json({ error: "could not delete", _id: _id});
        return;
      }

      //Remove
      Issue.findByIdAndRemove(mongoose.Types.ObjectId(_id), function(err, data){
        if (err)
        {
          console.error(err)
          res.json({ error: "could not delete", _id: _id});
        }
        if (data)
        {
          res.json({ result: "successfully deleted", _id: _id})
        } else {
          res.json({ error: "could not delete", _id: _id});
        }
      })
    });
    
};
