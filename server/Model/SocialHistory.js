module.exports = SocialHistory

function SocialHistory(alimentation, alcoholConsumption,ethnicity,physicalExercise,exposureToAnimals,recreationalDrugs,sunExposure,hobbies,recentTrips,
    smoking,dailyMakeUpUse,systemicDrugsUse,professionalActivity,other){   
    this.Alimentation = alimentation || "Não"
    this.AlcoholConsumption = alcoholConsumption
    this.Ethnicity = ethnicity
    this.PhysicalExercise = physicalExercise
    this.ExposureToAnimals = exposureToAnimals || "Não"
    this.RecreationalDrugs = recreationalDrugs || "Não"
    this.SunExposure = sunExposure
    this.Hobbies = hobbies || "Não"
    this.RecentTrips = recentTrips || "Não"
    this.Smoking = smoking || "Não"
    this.DailyMakeUpUse = dailyMakeUpUse || "Não"
    this.SystemicDrugsUse = systemicDrugsUse || "Não"
    this.ProfessionalActivity = professionalActivity || "Não"
    this.Other = other || "Não"
}