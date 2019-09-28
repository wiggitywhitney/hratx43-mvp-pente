const express = require('express');
//const bodyParser = require('body-parser');
const socket = require('socket.io');
const port = process.env.PORT || 80;
//const axios = require('axios');
const app = express();
const server = require('http').Server(app);

// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// const items = require('../database-mysql');
// const items = require('../database-mongo');

server.listen(`${port}`);

app.use(express.static(__dirname + '/../react-client/dist'));

//const server = app.listen(port, () => console.log(`server listening on port ${port}!`));

const io = socket(server);

io.on('connection', function(socket){

  console.log(`${socket.id} connected!`)

  socket.on('setGlobalState', (state)=>{
    io.emit('currentState', state);
  });

});



// app.get('/items', function (req, res) {
//   items.selectAll(function(err, data) {
//     if(err) {
//       res.sendStatus(500);
//     } else {
//       res.json(data);
//     }
//   });
// });

// app.listen(port, function() {
//   console.log('listening on port 3000!');
// });

