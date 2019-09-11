//If adminIDList has not been setup, always return true
//If adminIDList has been setup, check if userID matches to it.
module.exports = {
  checkAdmin: function(userID, adminIDList) {
    if (adminIDList){
        return adminIDList.includes(userID);
    } 
    else return true;
  }
};