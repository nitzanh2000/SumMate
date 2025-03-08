import { useState } from "react";
import PostForm from "../components/AddPostForm";

export interface PostData {
  content: string;
  photo?: File | null;
}

const AddPost = () => {
  const [formData, setFormData] = useState<PostData>({
    content: "",
    photo: null,
  });

  const handleInputChange = (
    field: keyof PostData,
    value: string | File | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-2 vh-90">
      <div
        className="card p-5"
        style={{ width: "450px", height: "75vh", borderRadius: "50px"}}
      >
        <div className="text-center mb-2">
          <h4 className="mt-2">Add New Post</h4>
        </div>
        <PostForm formData={formData} onInputChange={handleInputChange} />
      </div>
    </div>
  );
};

export default AddPost;
