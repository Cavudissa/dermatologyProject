module.exports = FamilyMedicalHistory

function FamilyMedicalHistory(atopias, baldness,cancer,cutaneous,diabetes,skinDiseases,others) {
    this.Atopias = atopias ||  "Não"
    this.Baldness = baldness ||  "Não"
    this.Cancer = cancer||  "Não"
    this.Cutaneous = cutaneous ||  "Não"
    this.Diabetes = diabetes ||  "Não"
    this.SkinDiseases = skinDiseases || "Não"
    this.Others = others || "Não"
}