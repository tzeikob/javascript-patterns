var myNS = myNS || Object.create(null);

myNS.domain = function domain() {
  const User = function User(data) {
    this.username = data.username;
    this.password = data.password;
  };

  User.prototype.log = function log() {
    console.log(`User{ username: ${this.username} }`);
  };

  const Task = function Task(data) {
    this.title = data.title;
    this.description = data.description;
  };

  Task.prototype.log = function log() {
    console.log(`Task{ title: ${this.title}, assignee: ${this.assignee.username} }`);
  };

  Task.prototype.assign = function assign(user) {
    this.assignee = user;
  };

  const dict = [{
      name: 'user',
      source: User
    },
    {
      name: 'task',
      source: Task
    }];

  const vocab = {};

  dict.forEach(item => {
    vocab[item.name] = item.source;
  });

  return vocab;
}();

let user = new myNS.domain.user({
  username: 'bob',
  password: 'pwd'
});

let task = new myNS.domain.task({
  title: 'My Task',
  description: 'Blah blah'
});

task.assign(user);
task.log(); // Task{ title: My Task, assignee: bob }
