import { FiUpload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";

interface DropzoneComponentProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const DropzoneComponent = ({
  onFileSelect,
  selectedFile,
}: DropzoneComponentProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="form-group">
      <div
        {...getRootProps({
          className:
            "dropzone rounded-circle border d-flex justify-content-center align-items-center",
        })}
        className="dropzone d-flex justify-content-center align-items-center m-1"
        style={{ border: "2px dashed", borderRadius: "50px", padding: "15px" }}
      >
        <input style = {{borderRadius: "50px" }} {...getInputProps()} />
        {selectedFile ? (
          <img className="img-fluid"  style={{height: "200px"}} src={URL.createObjectURL(selectedFile)} />
        ) : (
          <div className="text-center">
            <FiUpload size={20} color="#007bff" />
            <p>Drag and drop an image, or click to select one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropzoneComponent;
