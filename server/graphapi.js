const fetch = require("node-fetch");
const FormData = require("form-data");

const TENANT = process.env.MSGRAPH_TENANT;
const CLIENTID = process.env.MSGRAPH_CLIENTID;
const TOKEN = process.env.MSGRAPH_TOKEN;

// See https://docs.microsoft.com/en-us/graph/auth-v2-service?view=graph-rest-1.0#token-request

async function getAuthSecret() {
  const url = "https://login.microsoftonline.com/" + TENANT + "/oauth2/v2.0/token";
  const bodyFormData = new FormData();
  bodyFormData.append('client_id', CLIENTID);
  bodyFormData.append('client_secret', TOKEN);
  bodyFormData.append('scope', 'https://graph.microsoft.com/.default');
  bodyFormData.append('grant_type', 'client_credentials');

    // Need to add logic to cache and reuse non-expired access tokens

    try {
        return fetch(url, {
           headers: {
	      'client_id': CLIENTID,
 	      'scope': 'https%3A%2F%2Fgraph.microsoft.com%2F.default'
    	   },
           method: "POST",
           body: bodyFormData
         })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
  callApiWithToken: async function(apiEndpoint) {
     return getAuthSecret().then(response => {
        return response.json().then((data) => {
           const accessToken = data.access_token;
           try {
             return fetch(apiEndpoint, {
                headers: {
	           'Authorization': accessToken
    	        },
                method: "GET"
	     }).then(response2 => {
               return response2.json().then((data2) => {
	         return data2;
               });
             });
           } catch (error) {
             console.log(error);
           }
        });
     });
  }
};
