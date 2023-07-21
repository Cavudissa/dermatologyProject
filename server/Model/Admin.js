module.exports = Admin

function Admin(idType, idNumber,name,lastName,status,email) {
    this.IDType = idType
    this.IDNumber = idNumber
    this.Name = name
    this.LastName = lastName
    this.Status = status
    this.Email = email

}

Admin.prototype.toString = function () {
    return `{idType: ${this.IdType}, idNumber: ${this.IdNumber}, name: ${this.Name}, 
    lastName: ${this.LastName}, status: ${this.Status}, email: ${this.Email}}`
}

