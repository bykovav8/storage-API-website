const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");
const fetch = require("node-fetch");
const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const connectionKey = process.env.BlobConnectionKey;

    try {
      // connect to the blob service with connection key from Azure
      const blobClient = BlobServiceClient.fromConnectionString(connectionKey);
      // get a reference to the blob container
      const blobContainer = blobClient.getContainerClient("test-container");
      // instantiate a reference to a file in the blob container
      const blockBlobClient = blobContainer.getBlockBlobClient("program4-azure-file");

      const url = "https://css490.blob.core.windows.net/lab4/input.txt"

      const response = await fetch(url);

      // that's our file converted to string
      const responseFileContents = await response.text();

      await blockBlobClient.upload(responseFileContents, responseFileContents.length);

      const azureTable = TableClient.fromConnectionString(connectionKey, "DimpseyData");

      const fileLines = responseFileContents.trim().split(/\r?\n/);

      for (let line of fileLines){

        line = line.split(/\s+/);
        const entity = {}

        for (let word of line){
          if(entity["partitionKey"] == undefined)
            entity["partitionKey"] = word;
          else if (entity["rowKey"] == undefined) {
            entity["rowKey"] = word;
          }
          else {
            let keyValArr = word.split("=");
            let key = keyValArr[0];
            let val = keyValArr[1];
            entity[key] = val;
          }
        }
        await azureTable.upsertEntity(entity);
      } 

      const entitiesItr = azureTable.listEntities();
      let entityList = [];

      for await (entity of entitiesItr) {
        entityList.push(entity);
      }
      // for testing for now to see what HTTP response body displays
      context.res.json({
        status: 200,
        body: entityList
      });
    }
    catch (e) {
      context.res.json({
        status: 500,
        body: "Failed to upload to Blob storage: " + e
      });
    }
}