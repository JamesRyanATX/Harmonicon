import { Model } from "@composer/util";
import { jsonnable } from "./mixins.js";

export class BaseModel extends jsonnable(Model) {
}