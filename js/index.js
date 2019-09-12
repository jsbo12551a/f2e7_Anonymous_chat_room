// http://single9.net/2017/12/node-js-%e8%88%87-socket-io-%e5%8d%b3%e6%99%82%e8%81%8a%e5%a4%a9%e5%ae%a4%e5%af%a6%e4%bd%9c/amp/
// 安裝node後
// npm init -y
// npm install -S express socket.io

// 創建http伺服器
const express = require('express');
const app = express();

// Socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// 加入線上人數計數
let onlineCount = 0;
// 當發生連線事件
io.on('connection', socket => {
  // 有連線發生時增加人數
  onlineCount++;
  // 發送人數給網頁
  io.emit('online', onlineCount);

  // 接收來自前端的 greet 事件
  // 然後回送 greet 事件，並附帶內容
  socket.on('greet', () => {
    socket.emit('greet', 'Hi! Client.');
  });

  // 當發生離線事件
  socket.on('disconnect', () => {
    // 有人離線了，扣人
    onlineCount = onlineCount < 0 ? 0 : (onlineCount -= 1);
    io.emit('online', onlineCount);
  });
  socket.on('send', msg => {
    console.log(msg);
    io.emit('msg', msg);
  });
});
server.listen(3000, () => {
  console.log('Server Started. http://localhost:3000');
});
