import { ExpressionModel } from "@composer/core";

export const expression = function (source) {
  if (source instanceof ExpressionModel) {
    return source;
  }
  else {
    return ExpressionModel.parse({ source });
  }
}