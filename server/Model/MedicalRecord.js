module.exports = MedicalRecord
function MedicalRecord(skinType,TeamNotes,date,phototype,photoaging,currentTanning,pallor,integrity,humidity,texture,
    thickness,temperature,elasticity,mobility,turgor,sensitivity,sunBurn,affectedArea,quantity,
    comparison,disposition,distribution,pattern,colorChange,skinLayers,skinColor,otherSignals,hairs,location,adenomegalia,linfedema) {
    this.SkinType= skinType
    this.Phototype=phototype
    this.TeamNotes= TeamNotes
    this.Date = date
    this.Photoaging = photoaging
    this.CurrentTanning = currentTanning
    this.Pallor = pallor
    this.Integrity = integrity
    this.Humidity = humidity
    this.Texture = texture
    this.Thickness = thickness
    this.Temperature = temperature
    this.Elasticity = elasticity
    this.Mobility = mobility
    this.Turgor = turgor
    this.Sensitivity = sensitivity
    this.SunBurn = sunBurn
    this.AffectedArea = affectedArea
    this.Quantity = quantity
    this.Comparison = comparison
    this.Disposition = disposition
    this.Distribution = distribution
    this.Pattern = pattern
    this.ColorChange = colorChange
    this.SkinLayers = skinLayers
    this.SkinColor = skinColor
    this.OtherSignals = otherSignals
    this.Hairs = hairs
    this.Location = location
    this.Adenomegalia = adenomegalia
    this.Linfedema = linfedema
}


