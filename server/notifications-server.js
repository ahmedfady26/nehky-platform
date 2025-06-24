// خادم Socket.IO للإشعارات اللحظية
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

// إعداد Socket.IO مع دعم CORS
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// تخزين اتصالات المستخدمين
const userConnections = new Map();

// عند اتصال مستخدم جديد
io.on('connection', (socket) => {
  console.log(`✅ مستخدم متصل: ${socket.id}`);

  // ربط المستخدم بـ Socket ID
  socket.on('join', (userId) => {
    userConnections.set(userId, socket.id);
    socket.userId = userId;
    console.log(`👤 المستخدم ${userId} انضم بـ Socket ${socket.id}`);
  });

  // إرسال إشعار لمستخدم محدد
  socket.on('send-notification', (data) => {
    const { userId, notification } = data;
    const targetSocketId = userConnections.get(userId);
    
    if (targetSocketId) {
      io.to(targetSocketId).emit('notification', {
        ...notification,
        id: generateId(),
        createdAt: new Date(),
        read: false
      });
      console.log(`📢 تم إرسال إشعار للمستخدم ${userId}`);
    }
  });

  // إرسال إشعار لجميع المستخدمين
  socket.on('broadcast-notification', (notification) => {
    io.emit('notification', {
      ...notification,
      id: generateId(),
      createdAt: new Date(),
      read: false
    });
    console.log('📢 تم إرسال إشعار لجميع المستخدمين');
  });

  // عند انقطاع الاتصال
  socket.on('disconnect', () => {
    if (socket.userId) {
      userConnections.delete(socket.userId);
      console.log(`❌ المستخدم ${socket.userId} انقطع اتصاله`);
    }
  });
});

// API لإرسال الإشعارات من الخادم
app.post('/api/send-notification', (req, res) => {
  const { userId, notification } = req.body;
  
  if (!userId || !notification) {
    return res.status(400).json({ error: 'معطيات مفقودة' });
  }

  const targetSocketId = userConnections.get(userId);
  
  if (targetSocketId) {
    io.to(targetSocketId).emit('notification', {
      ...notification,
      id: generateId(),
      createdAt: new Date(),
      read: false
    });
    res.json({ success: true, message: 'تم إرسال الإشعار' });
  } else {
    res.status(404).json({ error: 'المستخدم غير متصل' });
  }
});

// API لإرسال إشعار جماعي
app.post('/api/broadcast-notification', (req, res) => {
  const { notification } = req.body;
  
  if (!notification) {
    return res.status(400).json({ error: 'معطيات مفقودة' });
  }

  io.emit('notification', {
    ...notification,
    id: generateId(),
    createdAt: new Date(),
    read: false
  });
  
  res.json({ success: true, message: 'تم إرسال الإشعار لجميع المستخدمين' });
});

// دالة لإنتاج معرف فريد
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// بدء تشغيل الخادم
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 خادم الإشعارات يعمل على المنفذ ${PORT}`);
});

module.exports = { io, app };
