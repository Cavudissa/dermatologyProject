module.exports = MedicalHistory

function MedicalHistory(height, weightHistory,weight,bmi,bloodType,anorexia,allergicAntecedents,atopias,surgeries,
    comorbidities,diseases,clinicalDiseases,sah,vaccination,thyroid,transfusions) {
    this.Height = height
    this.WeightHistory = weightHistory
    this.Weight = weight
    this.BMI = bmi
    this.BloodType = bloodType
    this.Anorexia = anorexia || "Não"
    this.AllergicAntecedents = allergicAntecedents
    this.Atopias = atopias
    this.PreviousSurgeries = surgeries || "Não"
    this.Comorbidities = comorbidities || "Não"
    this.Diseases = diseases || "Não"
    this.ClinicalDiseases = clinicalDiseases
    this.SAH = sah || "Não"
    this.Vaccination = vaccination || "Não"
    this.Thyroid = thyroid || "Não"
    this.Transfusions = transfusions || "Não"
}