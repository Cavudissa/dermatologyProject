module.exports = SharedPermission

function SharedPermission(Team,Patient,didPatientAccepted,text,dValue,kValue) {
   this.Team = Team
   this.Patient = Patient
   this.DidPatientAccepted=didPatientAccepted
   this.text = text
   this.dValue = dValue
   this.kValue = kValue

}

SharedPermission.prototype.toString = function () {
    let team = ''
    this.Team.forEach(e => team += e.toString())
    let patient = ''
    this.Patient.forEach(e => patient += e.toString())
    return `{Patients: [ ${patient} ], Teams: [ ${team} ]}`
}

