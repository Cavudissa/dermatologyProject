'use strict';

module.exports = function(Doctor) {
    var isStatic = true;
    Doctor.disableRemoteMethodByName('create_team_doctors',false);
};
