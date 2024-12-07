import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand , GetObjectCommand} from "@aws-sdk/client-s3";

//creating s3 client to connect to aws
const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials : {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    }
})

export {
    s3Client,
    ListObjectsV2Command,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand
  };