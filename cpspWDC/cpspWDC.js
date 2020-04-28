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
        $.ajax({
            url: 'https://cpspgear.solomondev.access-company.com/v1/a_LRPttPOD/g_MdTGtHYP/data/dataForGraph',
            beforeSend: function(xhr) {
                // include authorization key
                 xhr.setRequestHeader("Authorization", "authKey")
            }, success: function(data){
                //console.log(data[0]._id, data[0].appData)
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
                //alert(data);
                //process the JSON data etc
            }
    })
    };

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "CPSPF sensor Feed";
            tableau.submit();
        });
    });
})();