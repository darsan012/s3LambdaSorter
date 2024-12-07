import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { s3Client, PutObjectCommand, DeleteObjectCommand } from "./config/aws.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const App = () => {
  const [fileName, setFileName] = useState("");
  const [sortedFileUrl, setSortedFileUrl] = useState(""); // To store the signed URL
  const [uploadMessage, setUploadMessage] = useState("");

  // Handle file drop, after file is dropped it will be uploaded to s3 bucket 1
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file || file.type !== "text/plain") {
      setUploadMessage("Only .txt files are allowed!");
      return;
    }

    const params = {
      Bucket: import.meta.env.VITE_S3_BUCKET1_NAME,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    // upload to s3 bucket
    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      setFileName(file.name);
      console.log("File Uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Handle file sorting and generating signed URL for sorted file
  const handleSort = async () => {
    const sortedFileName = `sorted-${fileName}`;
    const bucket2Name = import.meta.env.VITE_S3_BUCKET2_NAME;

    try {
      // Check if the sorted file exists in the second bucket
      const getObjectCommand = new GetObjectCommand({
        Bucket: bucket2Name,
        Key: sortedFileName,
      });

      // Generate the signed URL for the sorted file
      const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 }); // URL expires in 1 hour

      // Set the signed URL for downloading the file
      setSortedFileUrl(signedUrl);
    } catch (error) {
      console.error("Error generating signed URL:", error);
      setUploadMessage("Failed to generate signed URL.");
    }
  };

  // Handle delete
  const deleteFile = async () => {
    const command = new DeleteObjectCommand({
      Bucket: import.meta.env.VITE_S3_BUCKET1_NAME,
      Key: fileName,
    });
    await s3Client.send(command);
    setFileName("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"], // MIME type and file extension for .txt files
    },
  });

  return (
    <div className="flex flex-col items-center py-32 min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">.txt file sorter</h1>

      {/* Dropbox */}
      <div
        {...getRootProps()}
        className={`w-full max-w-lg p-6 border-dashed border-2 rounded-md mb-4 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-600">
          {isDragActive ? "Drop the file here..." : "Drag & drop a .txt file here, or click to select one."}
        </p>
      </div>

      {/* For previewing the dropped files */}
      {fileName && (
        <div className="my-4 w-full max-w-lg p-4 bg-white border rounded-md shadow text-center flex justify-between items-center">
          <p className="text-gray-800 font-medium">File: {fileName}</p>
          <button
            onClick={deleteFile}
            className="mt-2 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            Delete File
          </button>
        </div>
      )}

      {/* Sort Button, handle aws s3 upload here */}
      <button
        onClick={handleSort}
        className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
      >
        Sort Text
      </button>

      {/* Display Download Button if sorted file URL is available */}
      {sortedFileUrl && (
        <div className="mt-4">
          <a
            href={sortedFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition"
          >
            Download Sorted File
          </a>
        </div>
      )}

      {/* Display Upload Message */}
      {uploadMessage && (
        <div className="mt-4 text-red-500 font-semibold">{uploadMessage}</div>
      )}
    </div>
  );
};

export default App;
