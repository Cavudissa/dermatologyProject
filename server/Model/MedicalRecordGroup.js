module.exports = MedicalRecordGroup

function MedicalRecordGroup(pathology,description,status,mainComplaint,startedWhen,startedLocation,type,intensity,
    constancy,dispersal,injuryChanges,injuryEvolution,trigger,previousTreatment,others) {
    this.Pathology= pathology
    this.Description = description
    this.Status = status
    this.MainComplaint = mainComplaint
    this.StartedWhen = startedWhen
    this.StartedLocation = startedLocation
    this.Type = type
    this.Intensity = intensity
    this.Constancy = constancy
    this.Dispersal = dispersal
    this.InjuryChanges = injuryChanges
    this.InjuryEvolution = injuryEvolution
    this.Trigger = trigger
    this.PreviousTreatment = previousTreatment
    this.Others = others
}

MedicalRecordGroup.prototype.toString = function () {
    return `{Pathology: ${this.Pathology}, Description: ${this.Description}, 
     status: ${this.Status}}`
}

