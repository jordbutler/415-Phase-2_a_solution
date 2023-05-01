const { MongoClient } = require("mongodb");

// Connection to the mongodb
const uri = "mongodb+srv://w0708515:KvvngAcid253@jbdb.wr4nvvi.mongodb.net/?retryWrites=true&w=majority";

const express = require('express');
const app = express();
const port = 3000;
var fs = require("fs");
var xmlparser = require('express-xml-bodyparser');
var js2xmlparser = require("js2xmlparser");
var convert = require('xml-js');

app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xmlparser());


app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('./menu.html', 'utf8', (err, contents) => {
      if(err) {
          console.log('Form file Read Error', err);
          res.write("<p>Form file Read Error");
      } else {
          console.log('Form loaded\n');
          res.write(contents + "<br>");
      }
      res.end();
    });
});

// GET All tickets

app.get("/rest/list/", function(req, res){
    
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("jbdb");
            const ticketDb = database.collection("cmps415mongodb");
        
            const query = {}; 
        
            
            const tickets = await ticketDb.find(query).toArray(); 
           
            if (tickets.length === 0) {
                res.status(404).send("Tickets do not exist!");
            } else {
                console.log(js2xmlparser.parse("tickets", tickets));
                
                res.json(js2xmlparser.parse("tickets", tickets));
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Error!");
        }finally {
           
            await client.close();
        }
    }
    run().catch(console.dir);
});

// GET ticket by id

app.get("/rest/ticket/:ticketId", function(req, res) {
    const client = new MongoClient(uri);
    
    const searchKey = "ticketID: '" + req.params.ticketId + "'";
    console.log("Looking for: " + searchKey);

    async function run() {
        try {
            const database = client.db("jbdb");
            const ticketDb = database.collection("cmps415mongodb");
      
            const query = { ticketID: req.params.ticketId };
      
            
            const ticket = await ticketDb.findOne(query);
            
            if (ticket === null) { 
                res.status(404).send("Ticket does not exist!");
            } else {
                console.log(js2xmlparser.parse("tickets", ticket));
                
                res.json(js2xmlparser.parse("tickets", ticket));
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Error!")
        } finally {
            
            await client.close();
        }
    }
    run().catch(console.dir);
});

// DELETE request

app.delete("/rest/ticket/:ticketId", function(req, res) {
    const client = new MongoClient(uri);
   
    const searchKey = "ticketID: '" + req.params.ticketId + "'";
    console.log("Looking for: " + searchKey);

    async function run() {
        try {
            const database = client.db("jbdb");
            const ticketDb = database.collection("cmps415mongodb");
      
            const query = { ticketID: req.params.ticketId };
      
            
            const deleteTicket = await ticketDb.deleteOne(query);
            
            if (deleteTicket.deletedCount === 0) {
                res.status(404).send("Ticket does not exist!");
            } else {
                console.log(deleteTicket);
                res.status(200).send(`Ticket with ticketID: ${req.params.ticketId} has been deleted!`);
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Error!")
        } finally {
            
            await client.close();
        }
    }
    run().catch(console.dir);
});

// POST request

app.get('/postform', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('./post.html', 'utf8', (err, contents) => {
      if(err) {
          console.log('Form file Read Error', err);
          res.write("<p>Form file Read Error");
      } else {
          console.log('Form loaded\n');
          res.write(contents + "<br>");
      }
      res.end();
    });
  });

  app.post("/rest/xml/postTicket", function(req, res) {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("jbdb");
            const ticketDb = database.collection("cmps415mongodb");

            const created_at = new Date();
            const updated_at = new Date();
            


            const xml = req.body;
            

            
            const ticket = {
                ticketID: xml.ticket.ticketid[0],
                created_at: created_at,
                updated_at: updated_at,
                type: xml.ticket.type[0],
                subject: xml.ticket.subject[0],
                description: xml.ticket.description[0],
                priority: xml.ticket.priority[0],
                status: xml.ticket.status[0],
                recipient: xml.ticket.recipient[0],
                submitter: xml.ticket.submitter[0],
                assignee_id: xml.ticket.assignee_id[0],
                follower_ids: xml.ticket.follower_ids,
                tags: xml.ticket.tags
            };
            const addTicket = await ticketDb.insertOne(ticket);
            console.log(addTicket);
           res.json(ticket);
        } catch (err) {
            console.log(err);
            res.status(500).send("Error!")
        } finally {
            
            await client.close();
        }
    }
    run().catch(console.dir);
});

app.post("/rest/ticket/postTicket", function(req, res) {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("jbdb");
            const ticketDb = database.collection("cmps415mongodb");

            const ticketID = req.body.ticketID;
            const created_at = new Date();
            const updated_at = new Date();
            const type = req.body.type;
            const subject = req.body.subject;
            const description = req.body.description;
            const priority = req.body.priority;
            const status = req.body.status;
            const recipient = req.body.recipient;
            const submitter = req.body.submitter;
            const assignee_id = req.body.assignee_id;
            const follower_ids = req.body.follower_ids;
            const tags = req.body.tags;
            

            
            const ticket = {
                ticketID: ticketID,
                created_at: created_at,
                updated_at: updated_at,
                type: type,
                subject: subject,
                description: description,
                priority: priority,
                status: status,
                recipient: recipient,
                submitter: submitter,
                assignee_id: assignee_id,
                follower_ids: follower_ids,
                tags: tags
            };
    
            const addTicket = await ticketDb.insertOne(ticket);
            console.log(addTicket);
            res.json(ticket);
        } catch (err) {
            console.log(err);
            res.status(500).send("Error!")
        } finally {
            
            await client.close();
        }
    }
    run().catch(console.dir);
});

// PUT request

app.get('/putform', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('./put.html', 'utf8', (err, contents) => {
      if(err) {
          console.log('Form file Read Error', err);
          res.write("<p>Form file Read Error");
      } else {
          console.log('Form loaded\n');
          res.write(contents + "<br>");
      }
      res.end();
    });
  });

app.post("/rest/ticket/updateTicket", function(req, res) {
    console.log("yes");
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("jbdb");
            const ticketDb = database.collection("cmps415mongodb");

            const ticketID = req.body.ticketID;
            const updated_at = new Date();
            const type = req.body.type;
            const subject = req.body.subject;
            const description = req.body.description;
            const priority = req.body.priority;
            const status = req.body.status;
            const recipient = req.body.recipient;
            const submitter = req.body.submitter;
            const assignee_id = req.body.assignee_id;
            const follower_ids = req.body.follower_ids;
            const tags = req.body.tags;

            
            const ticket = {
                ticketID: ticketID,
                updated_at: updated_at,
                type: type,
                subject: subject,
                description: description,
                priority: priority,
                status: status,
                recipient: recipient,
                submitter: submitter,
                assignee_id: assignee_id,
                follower_ids: follower_ids,
                tags: tags
            };

            const updateTicket = await ticketDb.findOneAndUpdate({ ticketID: ticketID }, { $set: ticket });
            if (!updateTicket) {
                res.status(404).send("Ticket does not exist!");
            } else {
                console.log(updateTicket);
                res.json(ticket);
                res.status(200).send(`Ticket with ticketID: ${ticketID} has been updated!`);
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Error!")
        } finally {
            
            await client.close();
        }
    }
    run().catch(console.dir);

    
});


app.post("/rest/xml/updateTicket", function(req, res) {
    console.log("yes");
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("jbdb");
            const ticketDb = database.collection("cmps415mongodb");

            


            const xml = req.body;

            
            const updated_at = new Date();
            

           
            const ticket = {
                ticketID: xml.ticket.ticketid[0],
                updated_at: updated_at,
                type: xml.ticket.type[0],
                subject: xml.ticket.subject[0],
                description: xml.ticket.description[0],
                priority: xml.ticket.priority[0],
                status: xml.ticket.status[0],
                recipient: xml.ticket.recipient[0],
                submitter: xml.ticket.submitter[0],
                assignee_id: xml.ticket.assignee_id[0],
                follower_ids: xml.ticket.follower_ids,
                tags: xml.ticket.tags
            };

           
            const updateTicket = await ticketDb.findOneAndUpdate({ ticketID: ticket.ticketID }, { $set: ticket });
            if (!updateTicket) {
                res.status(404).send("Ticket does not exist!");
            } else {
                console.log(updateTicket);
                res.json(ticket);
                res.status(200).send(`Ticket with ticketID: ${ticket.ticketID} has been updated!`);
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Error!")
        } finally {
            
            await client.close();
        }
    }
    run().catch(console.dir);

    
});
