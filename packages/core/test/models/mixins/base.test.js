import { BaseModelMixin, composite } from '../../../src/models/mixins/base';

describe('BaseModelMixin', function () {

  describe('composite', function () {
    it('composites multiple mixins', function () {
      const Base = class {
        a = 1;
      };

      const Mixin1 = Base => class extends Base {
        b = 2;
      };

      const Mixin2 = Base => class extends Base {
        c = 3;
      };

      const Mixin3 = Base => class extends Base {
        d = 4;
      };

      const Composite = class extends composite(Base, Mixin1, Mixin2, Mixin3) {
        e = 5;
      }

      const obj = new Composite();

      expect(obj.a).toEqual(1);
      expect(obj.b).toEqual(2);
      expect(obj.c).toEqual(3);
      expect(obj.d).toEqual(4);
      expect(obj.e).toEqual(5);
    });
  });

  // describe('.composite', function () {
  //   it.only('creates a subclass', function () {      
  //     // const Mixin = (sc) => class extends sc() {
  //     //   foo () { return 'bar'; }
  //     // }

  //     // const Model = class extends Mixin(BaseModel) {
  //     //   static properties = {};

  //     //   bar () { return 'baz'; }
  //     // }

  //     class Mixin extends BaseModelMixin {
  //     }

  //     class ExampleModel extends composite(BaseModel, Mixin) {
  //       bar () {
  //         return 'baz';
  //       }
  //     }

  //     const example = new ExampleModel();

  //     expect(example.foo()).toEqual('bar')
  //     expect(example.bar()).toEqual('baz');
  //   });
  // })
})