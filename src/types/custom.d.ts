/*const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);*/

declare global {
  interface Array<T> {
    uniq(): Array<T>;
    groupBy: <T, K extends keyof any>(item: T) => K;
  }
}

Array.prototype.uniq = function () {
  return Array.from(new Set(this));
};

Array.prototype.groupBy = function (getKey: (item: T) => K) {
  return this.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
};

export default global;
