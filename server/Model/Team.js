module.exports =Team

function Team(Status,Leader,TeamName,Doctors,Nurses,kek,dek) {
    this.Status=Status
    this.Leader = Leader
    this.TeamName = TeamName
    this.Doctors = Doctors
    this.Nurses = Nurses
    this.kek = kek
    this.dek = dek
}

Team.prototype.toString = function () {
    let leader = ''
    this.Leader.forEach(e => leader += e.toString())
    
    return `{instituitionNumber: ${this.InstituitionID}, Status: ${this.Status}, TeamName: ${this.TeamName},
     Leader: [ ${leader} ]}`
}

