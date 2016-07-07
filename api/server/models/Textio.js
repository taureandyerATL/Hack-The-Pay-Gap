var textioPromise = require("./Textio-Promise");

module.exports = Textio => {
    Textio.process = (description,cb) => {
        textioPromise(description).then(result=>cb(null,result)).catch(error=>cb(error));
    };
    
    Textio.remoteMethod(
        'process', 
        {
          http: {path: '/', verb: 'Post'},
          accepts: [{arg: 'description', type: 'string'}],
          returns: {root: true, type: 'object'}
        }
    );
};