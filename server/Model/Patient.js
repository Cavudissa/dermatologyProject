module.exports = Patient

function Patient(idType, idNumber,name,lastName,status,gender,
    nationality,address,postalcode,email,instituteid,
    maritalstatus,nif,birthdate,phonenumber,
    cityofbirth,country_birth,frequentedInstitutions,kek,dek) {
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
        this.MaritalStatus = maritalstatus
        this.NIF = nif
        this.Birthdate = birthdate
        this.PhoneNumber = phonenumber
        this.CityofBirth = cityofbirth
        this.CountryofBirth = country_birth
        this.RegistedInstitutions= frequentedInstitutions
        this.kek = kek
        this.dek = dek
}

Patient.prototype.toString = function () {
    return `{idType: ${this.IDType}, idNumber: ${this.IDNumber}, name: ${this.Name}, 
    lastName: ${this.LastName}, status: ${this.Status}, gender:${this.Gender},institudeID: ${this.InstituteId}
    ,phoneNumber: ${this.PhoneNumber},birthdate:${this.Birthdate},nationality:${this.Nationality}, address:${this.Address}}`
}