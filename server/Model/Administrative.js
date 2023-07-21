module.exports = Administrative

function Administrative(name,instituitionNumber,adress,status,email,password,country) {
    this.InstituitionNumber= instituitionNumber
    this.Name = name
    this.Address = adress
    this.Status = status
    this.email = email
    this.password = password
    this.Country = country 
}

Administrative.prototype.toString = function () {
    return `{instituitionNumber: ${this.InstituitionNumber}, instituition Name: ${this.Name}, adress: ${this.Adress}, 
     status: ${this.Status}}`
}

