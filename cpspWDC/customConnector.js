(function () {
    var myConnector = tableau.makeConnector();
    myConnector.getSchema = function (schemaCallback) {
        tableau.log("Hello WDC with CPSPF!");
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "appData",
            alias: "appData",
            dataType: tableau.dataTypeEnum.object
        }, {
            id: "owner",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "createdAt",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "updatedAt",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "cpspData",
            alias: "sensor data from cpsp",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
        fetch('https://cpspgear.solomondev.access-company.com/v1/a_LRPttPOD/g_MdTGtHYP/data/dataForGraph',{
            method:'GET',
            headers:{
                "Authorization": d.session.key
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                tableData = [];

                //Iterate over the JSON object
                for (var i = 0, len = data.length; i < len; i++) {
                    tableData.push({
                        "id": data[i]._id,
                        "appData": data[i].appData,
                        "owner": data[i].owner,
                        "createdAt": data[i].createdAt,
                        "updatedAt": data[i].updatedAt,
                    });
                }

                table.appendRows(tableData);
                doneCallback();
            });
    
    };

    tableau.registerConnector(myConnector);
    myConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.basic;
        loginCPSP(tableau.username, tableau.password)
        initCallback();
        tableau.connectionName="CPSPF sensor Feed"
        // provide username
        tableau.username=""
        // provide password
        tableau.password=""
        
        tableau.submit();
    };

    
    function loginCPSP(uname, pass){
        adminBody = {
            "email":uname,
            "password":pass,
            "sessionLifetime": 2592000,
            "sessionLifetimeMarginMax": 30
        }        
        fetch("https://cpspgear.solomondev.access-company.com/v1/adminStaff/login", {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body:JSON.stringify(adminBody)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            d = data
            
        })
    };
})();