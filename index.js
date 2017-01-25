// app.js

var express = require('express');
var app = express();
server = require('http').createServer(app);
var io = require('socket.io')(server);
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shortid   = require('shortid');
var _ = require('lodash')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

mongoose.connect('mongodb://localhost/soundshare');

var Schema = mongoose.Schema;
var SessionSchema = Schema({
    url: String,
    sessions: Array,
    created: Date
});
var Session = mongoose.model('Session', SessionSchema);


app.use(express.static(__dirname + '/public'));


var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'test.smtp.sound.share@gmail.com',
        pass: 'test.smtp.sound.share@'
    }
};
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);







var counter = 0;

io.on('connection', function(client) {
    var sessionData = {};

    client.on('update', function(data) {
        console.log('data', data)


        Session.findOne({_id : data.session_id, 'sessions.session_node_id' :  data.session_node_id}, function(err, session_data) {
          if(err) {
            console.log(err);
          }
          session_data = session_data.sessions
          _.each(session_data, function(item) {
            if (item.session_node_id == data.session_node_id) {
              item.data.push(data.time);
            }
          });
          console.log(session_data)

          Session.update({_id: data.session_id}, {$set: {sessions: session_data}}, function(err, updated_shit) {
            client.emit('updated', session_data);
          });
        });

    });


});

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});


app.get('/api/session/:id/:session_node_id?', function(req, res, next) {
    var shareSession = false;
    if (typeof req.params.session_node_id === 'undefined' || req.params.session_node_id === null) {
      shareSession = true;
    }

    Session.findOne({
        _id: req.params.id
    }, function(e, session) {
        if (e) return res.json({
            error: 'can not retrieve data, #getData#003'
        });
        if (shareSession) {
          var my_id = shortid.generate();
          console.log('got session - ', session)
          var data = session.get('sessions')
          session.sessions.push({
            data: [],
            session_node_id: my_id
          });
          session.save( function(e, updated_session) {
            if(e) return res.json({error: 'can not update data, #getData#004'});
            updated_session = updated_session.toJSON();
            updated_session.session_node_id = my_id;
            console.log('updated session',updated_session)
            return res.json(updated_session);
          })
        } else {
          return res.json(session);
        }
    });
});

app.post('/api/session/create', function(req, res, next) {
    console.log(req.body)
    var url = req.body.url;
    var email = req.body.email;
    var my_id = shortid.generate();

    var session = new Session({
        url: url,
        sessions: [
          {
            data: [],
            session_node_id: my_id
          }
        ]
    });

    session.save(function(e, s) {
        if (e) return res.json({
            error: 'can not create session. #newSession#001'
        });
        s = s.toJSON();
        s.session_node_id = my_id;
        console.log(s)
        return res.json(s);
    });
});

/*
app.post('/api/share/email', function(req, res, next) {
    Session.findOne({
        _id: req.body.session_id
    }, function(e, session) {
        if (e) return res.json({
            error: 'can not find data. #updatingData#004'
        });
        console.log(session)
        var baseURL = 'http://localhost:4200/#/session/'
        var template = '<a href="'+ baseURL + session._id +'"> Ali wants to listen a song with you, 🐴 Click to Join Share </a>'
        console.log(template)
        var mailOptions = {
            from: '"Zain 👥" <zainulabidin302@gmail.com>', // sender address
            to: req.body.email , // list of receivers
            subject: 'SoundShare is on its way...... ✔', // Subject line
            html: template // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                return res.json({error: 'can not send'});
            }
            return res.json({result: 'ok'});
        });
    });
});

*/
console.log('wowo');
server.listen(4201);
