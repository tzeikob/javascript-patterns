var myNS = myNS || Object.create(null);

myNS.Task = function Task(data) {
  this.id = data.id;
  this.flyweight = myNS.factory.get(data.title, data.employee, data.priority, data.completed);
};

myNS.FlyweightTask = function FlyweightTask(title, employee, priority, completed) {
  this.title = title;
  this.employee = employee;
  this.priority = priority;
  this.completed = completed;
};

myNS.factory = function factory() {
  const items = {};
  let count = 0;

  const get = function get(title, employee, priority, completed) {
    const signature = String(title) + String(employee) + String(priority) + String(completed);

    if (!items[signature]) {
      items[signature] = new myNS.FlyweightTask(title, employee, priority, completed);
      count++;
    }

    return items[signature];
  };

  const size = function size() {
    return count;
  };

  return {
    get,
    size
  };
}();

myNS.collector = function collector() {
  const items = {};
  let count = 0;

  const add = function add(item) {
    items[item.id] = item;
    count++;

    return item;
  };

  const get = function get(id) {
    return items[id];
  };

  const size = function size() {
    return count;
  };

  return {
    add,
    get,
    size
  };
}();

const titles = ['Eat', 'Sleep', 'Work', 'Sing'];
const employees = ['Anna', 'Joe', 'Jake', 'Mark'];
const priorities = [1, 2, 3, 4, 5];
const completed = [true, false];

for (let i = 0; i < 10000; i++) {
  let task = new myNS.Task({
    id: i,
    title: titles[Math.floor(Math.random() * 4)],
    employee: employees[Math.floor(Math.random() * 4)],
    priority: priorities[Math.floor(Math.random() * 5)],
    completed: completed[Math.floor(Math.random() * 2)]
  });

  myNS.collector.add(task);
}

console.log(`Tasks: ${myNS.collector.size()}`);
console.log(`Flyweight Tasks: ${myNS.factory.size()}`);
