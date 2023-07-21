module.exports = DetailedMedicalRecord

function DetailedMedicalRecord(dimension, injuryType,cutaneousLesion,arrangement,texture,primaryInjuryType,evaluation,lymphNodes,axillaryChains,
    inguinalChains,interimDiagnosis,complementaryExams,cytopathologicalAnalysis,diagnosis,date,teamNotes) {
    this.Dimension = dimension
    this.InjuryType = injuryType
    this.CutaneousLesion = cutaneousLesion
    this.Arrangement = arrangement
    this.Texture = texture
    this.LymphNodes = lymphNodes
    this.PrimaryInjuryType = primaryInjuryType
    this.Evaluation = evaluation
    this.AxillaryChains = axillaryChains
    this.InguinalChains = inguinalChains
    this.InterimDiagnosis = interimDiagnosis
    this.ComplementaryExams = complementaryExams
    this.CytopathologicalAnalysis = cytopathologicalAnalysis
    this.Diagnosis = diagnosis
    this.Date = date
    this.TeamNotes= teamNotes
}