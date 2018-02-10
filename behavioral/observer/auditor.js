var myNS = myNS || Object.create(null);

myNS.User = function User(data) {
  this.id = data.id;
  this.name = data.name;
  this.notifications = [];
  this.observers = [];
};

myNS.User.prototype.notify = function notify(message) {
  this.notifications.push(message);

  this.ping({
    action: 'receive',
    subject: this.name,
    payload: message
  });
};

myNS.User.prototype.send = function send(message, user) {
  this.ping({
    action: 'send',
    subject: this.name,
    payload: message
  });

  user.notify(message);
};

myNS.User.prototype.attach = function attach(observer) {
  this.observers.push(observer);
};

myNS.User.prototype.ping = function ping(context) {
  this.observers.forEach(o => {
    o.notify(context);
  });
};

myNS.Auditor = function Auditor(cb) {
  this.cb = cb;
};

myNS.Auditor.prototype.notify = function notify(context) {
  this.cb(context);
};

let auditor = new myNS.Auditor((context) => {
  if (context.action === 'send') {
    console.log(`User ${context.subject} send the message: ${context.payload}`);
  } else if (context.action === 'receive') {
    console.log(`User ${context.subject} receive the message: ${context.payload}`);
  }
});

let u1 = new myNS.User({id: '1', name: 'Bob'});
let u2 = new myNS.User({id: '2', name: 'Alice'});

u1.attach(auditor);
u2.attach(auditor);

u1.send('Hi', u2);
u2.send('Hello', u1);
