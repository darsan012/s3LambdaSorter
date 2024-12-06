import { useState } from "react";
import { useDropzone } from "react-dropzone";

const App = () => {
  const [fileName, setFileName] = useState("");
  const [sortedText, setSortedText] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  // Handle text sorting
  const handleSort = () => {
  };

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    // validate input file extension
    if (!file || file.type !== "text/plain") {
      setUploadMessage("Only .txt files are allowed!");
      return;
    }
    console.log(file);
    setFileName(file.name);

  };

  // Handle delete
  const deleteFile = ()=>{
    setFileName("");
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".txt",
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
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

      {/* For previewing the dropped files*/}
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

      {/* Display Sorted Text Here */}
      {sortedText && (
        <div className="mt-4 w-full max-w-lg p-4 bg-white border rounded-md shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Sorted Text:</h2>
          <p className="text-gray-800">{sortedText}</p>
        </div>
      )}
    </div>
  );
};

export default App;
