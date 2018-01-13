let g = 'global';

const outer = function outer() {
  let o = 'outer';

  // At this point inner creates a closure around outer and global scope
  const inner = function inner() {
    let i = 'inner';

    console.log(`I have access to ${i}, ${o} and ${g} scope`);
  };

  return inner;
};

let fn = outer();

fn(); // 'I have access to inner, outer and global scope'
