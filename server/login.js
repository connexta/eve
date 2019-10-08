//If adminNameList has not been setup, always return true
//If adminNameList has been setup, check if userName matches to it.
module.exports = {
  checkAdmin: function(userName, adminNameList) {
    if (adminNameList) {
      return adminNameList.includes(userName);
    } else return true;
  }
};
