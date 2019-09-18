var S3 = require('aws-sdk/clients/s3');

const S3_BUCKET = process.env.S3_BUCKET;
const awsS3Config = 
{
	region : process.env.S3_REGION
};

exports.handler = (event, context, callback) => {
  console.log("Event Received : "+ JSON.stringify(event.body, null, 2));
  console.log("S3 Bucket : "+S3_BUCKET);
  const s3 = new S3(awsS3Config);
  var fileName = event.body.fileName;
  var fileType = event.body.fileType;
  console.log("fileName : "+fileName);
  console.log("fileType : "+fileType);
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  console.log("uploading with params: "+JSON.stringify(s3Params, null, 2));

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      callback(null, JSON.parse(JSON.stringify(err,null,2)));
    }
    else {
    	console.log(data);
    	const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		};
		
		var response = {
			"statusCode": 200,
			"headers": {
				"Content-Type": "application/json"
			},
			"body": JSON.stringify(returnData),
			"isBase64Encoded": false
		}
		
		callback(null, response);
    } 
  });
};