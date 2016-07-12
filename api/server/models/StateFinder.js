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
        //console.log('####################### - State Request Made ');
        unirest.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + urlencode(address) + ",US")
            .headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
            .end(function(response) {
                //console.log('####################### - State Response Recd ');
                if (response.code === 200) {
                    //console.log("#############################################");
                    console.log(JSON.stringify(response.body.results));
                    //console.log("#############################################");
                    resolve({
                        short_name: response.body.results[0].address_components[2].short_name,
                        long_name: response.body.results[0].address_components[2].long_name
                    });
                }
                else
                    reject(response);
            });
    });
};

let selfTest = () => {
    coreFunc('san jose')
        .then(local.log)
        .catch(local.log);
};

if (require.main === module) {
    selfTest();
}
else {
    module.exports = coreFunc;
}
