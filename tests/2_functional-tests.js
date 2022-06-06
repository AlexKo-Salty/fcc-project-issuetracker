const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('#1 - Create an issue with every field: POST request to /api/issues/{project}', function(done){
        chai
         .request(server)
         .post('/api/issues/apitest')
         .send({
            issue_title: "Test #1",
            issue_text: "Test #1",
            created_by: "Test #1",
            assigned_to: "Test #1",
            status_text: "Test #1"
         })
         .end(function (err,res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');          
            assert.equal(res.body.issue_title, "Test #1");
            assert.equal(res.body.issue_text, "Test #1");
            assert.equal(res.body.created_by, "Test #1");
            assert.equal(res.body.assigned_to, "Test #1");
            assert.equal(res.body.status_text, "Test #1");
            assert.equal(res.body.project_name, "apitest");
            assert.isOk(res.body.created_on);
            assert.isOk(res.body.updated_on);
            assert.equal(res.body.open, true);
            done();
         });
    });
    test('#2 - Create an issue with only required fields: POST request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
           issue_title: "Test #2",
           issue_text: "Test #2",
           created_by: "Test #2",
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.issue_title, "Test #2");
           assert.equal(res.body.issue_text, "Test #2");
           assert.equal(res.body.created_by, "Test #2");
           assert.equal(res.body.assigned_to, "");
           assert.equal(res.body.status_text, "");
           assert.equal(res.body.project_name, "apitest");
           assert.isOk(res.body.created_on);
           assert.isOk(res.body.updated_on);
           assert.equal(res.body.open, true);
           done();
        });
    });
    test('#3 - Create an issue with missing required fields: POST request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
           issue_title: "Test #3",
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.error, "required field(s) missing");
           done();
        });
    });
    test('#4 - View issues on a project: GET request to /api/issues/{project}', function(done){
        chai
         .request(server)
         .get('/api/issues/apitest')
         .end(function (err,res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            if (res.data && res.data.length > 0)
            {
                res.data.array.forEach(function(item) {
                    assert.equal(item.project_name === "apitest");
                });
            }
            done();
         });
    });
    test('#5 - View issues on a project with one filter: GET request to /api/issues/{project}', function(done){
        chai
         .request(server)
         .get('/api/issues/apitest?open=true')
         .end(function (err,res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            if (res.data && res.data.length > 0)
            {
                res.data.array.forEach(function(item) {
                    assert.equal(item.project_name === "apitest");
                    assert.equal(item.open === true);
                });
            }
            done();
         });
    });
    test('#6 - View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done){
        chai
         .request(server)
         .get('/api/issues/apitest?open=true&created_by=Alex')
         .end(function (err,res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            if (res.data && res.data.length > 0)
            {
                res.data.array.forEach(function(item) {
                    assert.equal(item.project_name === "apitest");
                    assert.equal(item.open === true);
                    assert.equal(item.created_by === "Alex")
                });
            }
            done();
         });
    });
    test('#7 - Update one field on an issue: PUT request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
            _id: "629d982e605a4cda879c266c",
           issue_title: "Test #7",
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.result, "successfully updated");
           assert.equal(res.body._id, "629d982e605a4cda879c266c");
           done();
        });
    });
    test('#8 - Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
            _id: "629d982e605a4cda879c266c",
           issue_title: "Test #8",
           issue_text: "Test #8"
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.result, "successfully updated");
           assert.equal(res.body._id, "629d982e605a4cda879c266c");
           done();
        });
    });
    test('#9 - Update an issue with missing _id: PUT request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
           issue_title: "Test #7",
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.error, "missing _id");
           done();
        });
    });
    test('#10 - Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
            _id: "629d982e605a4cda879c266c",
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.error, "no update field(s) sent");
           assert.equal(res.body._id, "629d982e605a4cda879c266c");
           done();
        });
    });
    test('#11 - Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
            _id: "629d982e605a4cda879c2660",
            issue_title: "Test #11"
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.error, "could not update");
           assert.equal(res.body._id, "629d982e605a4cda879c2660");
           done();
        });
    });
    test('#12 - Delete an issue: DELETE request to /api/issues/{project}', function(done){
        //Create temp issue for testing
        let temp_id;
        chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
           issue_title: "Test #11",
           issue_text: "Test #11",
           created_by: "Test #11",
           assigned_to: "Test #11",
           status_text: "Test #11"
        })
        .end(function (err,res) {
           temp_id = res.body._id;
           console.log(temp_id);
           chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: temp_id,
           })
           .end(function (err,res) {
            console.log(res);
              assert.equal(res.status, 200);
              assert.equal(res.type, 'application/json');          
              assert.equal(res.body.result, "successfully deleted");
              assert.equal(res.body._id, temp_id);
              done();
           });
        });
    });
    test('#13 - Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
            _id: "abc123",
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.error, "could not delete");
           assert.equal(res.body._id, "abc123");
           done();
        });
    });
    test('#14 - Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
        })
        .end(function (err,res) {
           assert.equal(res.status, 200);
           assert.equal(res.type, 'application/json');          
           assert.equal(res.body.error, "missing _id");
           done();
        });
    });
});
