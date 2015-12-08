export default class Material {
  constructor(type, amount = 0, perTick = 0) {
    this.amount = amount
    this.type = type
    this.perTick = perTick
  }
}
