import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionByID(id) {
    let auction;

    try {
        let result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
        }).promise();

        auction = result.Item;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!auction) {

        throw new createError.NotFound(`Auction with ID ${id} Not Found`);
    }

    return auction;
}

async function getAuction(event, context) {
    const {id} = event.pathParameters;

    const auction = await getAuctionByID(id);

   return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  };
}

export const handler = commonMiddleware(getAuction);


