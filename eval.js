// evalute a string
// return the result in a promise
const evaluate = (str) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(eval(str));
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  evaluate
};