module.exports = Nurse

function Nurse(idType, idNumber,name,lastName,status,gender,nationality,address,postalcode
    ,email,instituteid,teams,workingInstitutions,kek,dek) {
    this.IDType = idType
    this.IDNumber = idNumber
    this.Name = name
    this.LastName = lastName
    this.Status = status
    this.Gender = gender
    this.Nationality = nationality
    this.Address = address
    this.PostalCode = postalcode
    this.Email = email
    this.InstituteID = instituteid
    this.Teams = teams
    this.RegistedInstitutions= workingInstitutions
    this.kek = kek
    this.dek =  dek
}

Nurse.prototype.toString = function () {
    return `{idType: ${this.IDType}, idNumber: ${this.IDNumber}, name: ${this.Name}, 
    lastName: ${this.LastName}, status: ${this.Status}, gender:${this.Gender},institudeID: ${this.InstituteId}}`
}