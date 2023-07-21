module.exports = KeyValuePair

function KeyValuePair(Name,Description) {
    this.Name= Name
    this.Description = Description


}

KeyValuePair.prototype.toString = function () {
    return `{Name: ${this.Name}, Description: ${this.Description}}`
}

