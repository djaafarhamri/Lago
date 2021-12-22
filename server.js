const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
const http = require('http');
const cors = require('cors')
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const socket = require("socket.io");
const jwt = require('jsonwebtoken');
const authRoutes = require('./Routes/authRoutes')
const path = require('path')
const User = require('./models/users');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000
// connect database

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('data base connecte'))
.catch((err) => {throw new Error (err)})



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers','X-HTTP-Method-Override, Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    return next();
  }
});
//app.use(cors())
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

//game socket :
//_______________________________________________________________________
const io = socket(server, {
  cors: {
    origin:"http://localhost:3000"
  }
});
var users = []
io.on('connection', (socket) => {
  socket.on('get_users', () => {
    io.emit('online_users', users)
  })
  socket.on('nickname', (name) => { 
    users.push({name:name, id:socket.id})
    io.emit('online_users', users)
  })
  socket.on('gameleave', (room) => { 
    io.to(room).emit('userleave')
  })
  socket.on("opname", data => {
    socket.broadcast.to(data.room).emit('getopname', data.name)
  })
  socket.on('play', (data) => {
    var count = 0;
    for (const user of users) {
      if (user.name === data.friend){
        socket.to(user.id).emit('challenge', ({name:data.name, time:data.time}))
        count += 1;
      }
    }
  })
  socket.on('accept', (data) => {
    var uid;
    for (const user of users) {
      if (user.name === data.challenger){
        uid = user.id;
      }
    }
    socket.to(uid).emit('friendGame', {room:data.room, time:data.time})
  })
  socket.on("room", (room) => {
    if (io.sockets.adapter.rooms.get(room) === undefined) {
      socket.join(room)
      io.emit("room added")      
    }
    else if (io.sockets.adapter.rooms.get(room) !== undefined && io.sockets.adapter.rooms.get(room).size < 2){
      socket.join(room)
      io.in(room).emit('start', io.sockets.adapter.rooms.get(room).size)
      socket.broadcast.emit('turn', 'b')
    } else {
      console.log('maximum users in a room is 2');
    }
  });
  socket.on('disconnect', () => {
    var index = 0
    for(const user of users){
      if (user.id === socket.id){
        users.splice(index)
      }
      index += 1
    }
    io.emit('user_dis', users)
  })
 

  socket.on("timeout", data => {
    socket.broadcast.to(data).emit("optimeout")
  })
  socket.on('timerSet', data => {
    socket.broadcast.to(data.room).emit('newTimer', data.time)
  })
  
  socket.on('draw_offer', room => {
    socket.broadcast.to(room).emit('OpDraw')
  })
  
  socket.on('resign', room => {
    socket.broadcast.to(room).emit('OpResign')
  })
  socket.on('offer_accepted', room => {
    socket.broadcast.to(room).emit('OpAccepteOffer')
  })
  
  socket.on("move", (move) => {
    socket.to(move[2]).emit('receive-move', [move[0], move[1]])
  });
  
});
  
//_______________________________________________________________________

app.get('/game', checkUser, requireAuth, (req, res) => {
  res.json({ user:req.currUser })
  res.status(200)  
})

//_______________________________________________________________________

app.use(authRoutes);

//---------------deployement--------------------

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}



server.listen(PORT, () => {
console.log('listening on PORT : ', PORT);
});
