import { mapParallel, mapSeries } from './enumerable';

export class Collection {

  get length () {
    return this.records.length;
  }

  get all () {
    return this.records.concat([]);
  }

  get foreignKey () {
    return this.definition.foreignKey;
  }

  constructor({ obj, type, records, property, definition }) {
    this.obj = obj;
    this.type = type;
    this.records = records;
    this.property = property;
    this.definition = definition;
  }

  add(record) {
    this.records.push(record);
    return record;
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

  bucketizeByProperty(property, {
    emptyBucket = null
  } = {}) {
    return this.records.reduce((buckets, record) => {
      const bucket = record[property] === undefined && emptyBucket ? emptyBucket : record[property];

      buckets[bucket] = buckets[bucket] || [];
      buckets[bucket].push(record);

      return buckets;
    }, {});
  }

  async create(properties = {}) {
    const record = this.add(
      await this.type.create(Object.assign({
        [this.foreignKey]: this.obj,
      }, properties))
    );

    await this.obj.save();

    return record;
  }

  async destroy(record) {
    const index = this.records.indexOf(record);

    await record.destroy();

    if (index > -1) {
      this.records.splice(index, 1);
    }

    return this.obj.save();
  }

  async load() {
    console.log(this.type);
  }

  async find(id) {
    return this.type.find(id, obj.storage);
  }

  // [todo] make dynamic
  getByName(value) {
    return this.filterByProperty('name', value)[0];
  }

  getByProperty(property, value) {
    return this.filterByProperty(property, value)[0];
  }

  filterByProperty(property, value) {
    return this.filter((item) => (item[property] === value));
  }

  map(fn) {
    return this.records.map(fn);
  }

  forEach(fn) {
    this.records.map(fn);
  }

  filter(fn) {
    return this.records.filter(fn);
  }

  reduce(fn, memo) {
    return this.records.reduce(fn, memo);
  }

  async mapParallel(fn) {
    return mapParallel(this.all, fn);
  }

  async mapSeries(fn) {
    return mapSeries(this.all, fn);
  }

}