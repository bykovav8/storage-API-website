const { odata, TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  const connectionKey = process.env.BlobConnectionKey;
    try {

      const azureTable = TableClient.fromConnectionString(connectionKey, "DimpseyData");

      let queryString = "";

      const { firstName, lastName } = req.query;
      // VS 
      // const firstName = req.query.firstName;
      // const lastName = req.query.lastName;

      if( firstName && lastName) {
        queryString = odata`PartitionKey eq ${firstName} and RowKey eq ${lastName}`;
      }
      else if(firstName) // && !lastName
      {
        queryString = odata`PartitionKey eq ${firstName}`;
      }
      else if(lastName){ // !firstName
        queryString = odata`RowKey eq ${lastName}`;
      }

      let result = azureTable.listEntities({
        queryOptions: {
          filter: queryString
        }
      });

      let resultData = [];
      for await (let item of result) {
        resultData.push(item);
      }

      context.res.json({
        status: 200,
        body: resultData
      });
    }
    catch (e) {
      context.res.json({
        status: 500,
        body: "Failed to execute query: " + e
      });
    }
}