
var fs = require("fs");
var csv = require("fast-csv");

module.exports = function(app) {
    
    app.get("/data/skills", function(req, res) {
        
        // res.send("test");
        // return;
    
        console.log("reading");
        var stream = fs.createReadStream("./api/data/skills_binaries.csv");
    
        var headers = ["Skills", "Leadership", "Communication", "Technical", "Functional"];
        
        var obj = {};
    
        var csvStream = csv()
            .on("error", function(err) {
                console.log(err);
                res.status(500).send(err);
            })
            .on("data", function(data){
                obj[data[0]] = 
                {
                    "Leadership": data[1].length > 0,
                    "Communication": data[2].length > 0,
                    "Technical": data[3].length > 0,
                    "Functional": data[4].length > 0
                };
            })
            .on("end", function(){
                console.log("FIN")
                res.send({ skills: obj });
            });
            
        stream.pipe(csvStream);
        
    });
};
