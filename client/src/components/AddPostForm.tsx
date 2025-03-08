import { z } from "zod";
import { useForm } from "react-hook-form";
import DropzoneComponent from "./Dropzone";
import { PostData } from "../pages/AddPost";
import { createPost } from "../services/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "../context/UserContext";
import { ACCEPTED_IMAGE_TYPES } from "../constants/files";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const formSchema = z.object({
  content: z.string().min(1, "Description is required"),
  photo: z
    .any()
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type FormData = z.infer<typeof formSchema>;

interface PostFormProps {
  formData: PostData;
  onInputChange: (field: keyof PostData, value: string | File | null) => void;
}

const PostForm = ({ formData, onInputChange }: PostFormProps) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  const { user } = useUserContext() ?? {};

  const onSubmit = async ({ content, photo }: PostData) => {
    try {
      if (isEmpty(errors)) {
        await createPost({ content, photo, owner: user!._id });
        navigate("/");
      }
    } catch (error) {
      console.error("error creating post", error);
      enqueueSnackbar("Failed to create post", { variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-4">
        <input
          style = {{borderRadius: "50px"}}
          {...register("content")}
          type="text"
          className="form-control"
          placeholder="Enter content"
          value={formData.content}
          onChange={(e) => onInputChange("content", e.target.value)}
        />
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}
      </div>

      <div className="mb-4">
        <DropzoneComponent
          onFileSelect={(file) => {
            setValue("photo", file);
            onInputChange("photo", file);
          }}
          selectedFile={formData.photo ?? null}
        />
        {errors.photo && <p className="text-danger">Photo is required</p>}
      </div>

      <button type="submit" className="btn btn-primary w-100" style={{ borderRadius: "50px" }}>
        Add Post
      </button>
    </form>
  );
};

export default PostForm;
