# Create the following function in the aws and add trigger option

import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client({region:'us-east-2'});

export const handler = async (event) => {
  // extracting the bucket name and the name of the file after trigger
  console.log("Event:", JSON.stringify(event, null, 2));

  const bucketName = event.Records[0].s3.bucket.name;
  const fileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  console.log(`Bucket: ${bucketName}, Key: ${fileName}`);

  

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    // getting the object from s3 bucket 
    const data = await s3Client.send(command)

    // data received is in stream format
    const body = await streamToString(data.Body);
    const sortedContent = sortContent(body);

    // upload the sorted content to bucket2
    const uploadCommand = new PutObjectCommand({
      Bucket: 'cloudcomputingbucket2', 
      Key: `sorted-${fileName}`,  
      Body: sortedContent,
      ContentType: 'text/plain',  
    });

    await s3Client.send(uploadCommand);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File sorted and uploaded successfully' }),
    };

  } catch (error) {
    console.error('Error processing file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing file', error: error.message }),
    };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};


// Helper function to convert a stream to a string
const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
  });
};

// Helper function to sort the content by the first letter of each line
const sortContent = (content) => {
  const lines = content.split('\n'); // Split content by lines
  lines.sort((a, b) => {
    // Handle empty lines or lines without valid first characters
    const firstCharA = a.trim()[0] || ''; // Get the first character of line A, or empty string if undefined
    const firstCharB = b.trim()[0] || ''; // Get the first character of line B, or empty string if undefined

    return firstCharA.localeCompare(firstCharB, undefined, { sensitivity: 'base' });
  });
  return lines.join('\n'); // Join the sorted lines back into a string
};

