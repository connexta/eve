const dotenv = require("dotenv");
dotenv.config();
const adminID = process.env.WALLBOARDADMIN;

//If adminID has not been setup, always return true
//If adminID has been setup, check if userID matches to it.
module.exports = {
  checkAdmin: function(userID) {
    if (adminID) return adminID === userID;
    else return true;
  }
};
