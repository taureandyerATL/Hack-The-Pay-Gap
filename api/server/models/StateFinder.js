'use strict';
var unirest = require("unirest");
var urlencode = require("urlencode");

let local = {
    log: message => {
        console.log(message);
    }
};

let coreFunc = address => {
    return new Promise((resolve, reject) => {
        unirest.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + urlencode(address) + ",US")
            .headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
            .end(function(response) {
                if (response.code === 200)
                    resolve({
                        short_name: response.body.results[0].address_components[2].short_name,
                        long_name: response.body.results[0].address_components[2].long_name
                    });
                else
                    reject(response);
            });
    });
};

let selfTest = () => {
    coreFunc('Dublin')
        .then(local.log)
        .catch(local.log);
};

if (require.main === module) {
    selfTest();
}
else {
    module.exports = coreFunc;
}
