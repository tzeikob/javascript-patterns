var myNS = myNS || Object.create(null);

myNS.module = function module() {
  const Repo = function Repo() {
    this.data = [
      {id: 'a', value: 'alfa'},
      {id: 'd', value: 'delta'}
    ];
  };

  Repo.prototype.get = function get(id) {
    let item = this.data.find(item => {
      return item.id === id;
    });

    if (!item) {
      return null;
    }

    return {id: item.id, value: item.value};
  };

  Repo.prototype.list = function list() {
    return this.data.map(item => {
      return {id: item.id, value: item.value};
    });
  };

  Repo.prototype.save = function save(id, value) {
    let index = this.data.findIndex(item => {
      return item.id === id;
    });

    if (index !== -1) {
      throw new Error(`Cannot save, item with id already exists: ${id}`);
    }

    this.data.push({id, value});
  };

  Repo.prototype.update = function update(id, value) {
    let item = this.data.find(item => {
      return item.id === id;
    });

    if (!item) {
      throw new Error(`Cannot update, item not found: ${id}`);
    }

    item.value = value;
  };

  Repo.prototype.remove = function remove(id) {
    let index = this.data.findIndex(item => {
      return item.id === id;
    });

    if(index === -1) {
      throw new Error(`Cannot remove, item not found: ${id}`);
    }

    this.data.splice(index, 1);
  };

  let singleton;

  return {
    getInstance: function getInstance() {
      if (!singleton) {
        singleton = new Repo();
      }

      return singleton;
    }
  };
}();

const repo = myNS.module.getInstance();
const repo2 = myNS.module.getInstance();

let results = repo.list();
results.forEach(item => console.log(item)); // { id: 'a', value: 'alfa' }, { id: 'd', value: 'delta' }

repo.update('a', 'alpha');
repo2.save('z', 'zeta');
repo.remove('d');

results = repo2.list();
results.forEach(item => console.log(item)); // { id: 'a', value: 'alpha' }, { id: 'z', value: 'zeta' }
