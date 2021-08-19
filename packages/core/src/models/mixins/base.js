export const BaseModelMixin = Base => class extends Base {
}

export const composite = function (base, ...mixins) {
  return mixins.reduce((base, mixin) => {
    return class extends mixin(base) {}
  }, base);
}