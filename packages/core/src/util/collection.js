import { mapParallel, mapSeries } from '@composer/util';

export class Collection {

  get length () {
    return this.records.length;
  }

  get all () {
    return this.records;
  }

  constructor(obj, records) {
    this.obj = obj;
    this.records = records;
  }

  add(record) {
    this.records.push(record);
  }

  at(index) {
    return this.records[index];
  }

  first() {
    return this.at(0);
  }

  last() {
    return this.at(this.length - 1);
  }

  async mapParallel(fn) {
    return mapParallel(this.all, fn);
  }

  async mapSeries(fn) {
    return mapSeries(this.all, fn);
  }

}