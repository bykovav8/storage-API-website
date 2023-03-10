const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");
const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  const connectionKey = process.env.BlobConnectionKey;

  try {
    // connect to the blob service with connection key from Azure
    const blobClient = BlobServiceClient.fromConnectionString(connectionKey);
    // get a reference to the blob container
    const blobContainer = blobClient.getContainerClient("test-container");
    // instantiate a reference to a file in the blob container
    const blockBlobClient = blobContainer.getBlockBlobClient("program4-azure-file");

    blockBlobClient.deleteIfExists();

    const azureTable = TableClient.fromConnectionString(connectionKey, "DimpseyData");

    let entitiesItr = azureTable.listEntities();
   
    for await (entity of entitiesItr) {
      azureTable.deleteEntity(entity.partitionKey, entity.rowKey);
    }

    let entityList = [];

    entitiesItr = azureTable.listEntities();
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
};