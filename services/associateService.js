var assocateDAL = require('../DAL/AssociateDAL');
var DALService =new assocateDAL();
    var associateService = function (){
        this.addAssociate= function(request){
            return DALService.addAssociate(request);
        }
    }

module.exports = associateService;