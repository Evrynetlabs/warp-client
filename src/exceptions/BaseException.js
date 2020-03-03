export default class BaseException extends Error {
  constructor(message, code, name) {
    const fullMsg = message ? `${code}: ${message}` : code
    super(fullMsg)
    this.message = message
    this.name = name || this.constructor.name
    this.code = code || `E_${this.name.toUpperCase()}`
  }
}
