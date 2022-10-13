declare global {
  interface Array<T> {
    uniq(): Array<T>;
  }
}

Array.prototype.uniq = function () {
  return Array.from(new Set(this));
};

export default global;
