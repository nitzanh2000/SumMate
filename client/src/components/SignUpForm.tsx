import { z } from "zod";
import { isEmpty } from "lodash";
import { useState } from "react";
import { signup } from "../services/auth";
import { useForm } from "react-hook-form";
import { SignUpData } from "../pages/SignUp";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "../context/UserContext";
import { ACCEPTED_IMAGE_TYPES } from "../constants/files";

type SignUpFormProps = {
  formData: SignUpData;
  onInputChange: (field: keyof SignUpData, value: string | File | null) => void;
};

const formSchema = z.object({
  username: z.string().min(6).max(10),
  password: z.string().min(6).max(10),
  email: z.string().email(),
  photo: z
    .any()
    .nullable()
    .refine(
      (files) =>
        !files?.length || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type formData = z.infer<typeof formSchema>;

const SignUpForm = ({ formData, onInputChange }: SignUpFormProps) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignUpData>({ resolver: zodResolver(formSchema) });

  const { setUser } = useUserContext() ?? {};

  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (userData: formData) => {
    try {
      if (isEmpty(errors)) {
        const user = await signup(userData);
        setUser?.(user);
        navigate("/");
      }
    } catch (error) {
      console.error("error signup user", error);
      if (error instanceof Error) {
        setServerError(error.message);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <input
          {...register("username")}
          type="text"
          className="form-control"
          placeholder="Username*"
          value={formData.username}
          onChange={(e) => onInputChange("username", e.target.value)}
        />
        {errors.username && (
          <p className="text-danger">{errors.username.message}</p>
        )}
      </div>
      <div className="mb-3">
        <input
          {...register("password")}
          type="password"
          className="form-control"
          placeholder="Password*"
          value={formData.password}
          onChange={(e) => onInputChange("password", e.target.value)}
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>
      <div className="mb-3">
        <input
          {...register("email")}
          type="text"
          className="form-control"
          placeholder="Email*"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>
      <div
        className="mb-3 border p-3 text-center"
        style={{ borderStyle: "dashed", borderColor: "#ced4da" }}
      >
        <label htmlFor="photo" className="form-label d-block text-muted">
          Profile Photo
        </label>
        {errors.photo && <p className="text-danger">{errors.photo.message}</p>}
        <input
          {...register("photo")}
          type="file"
          className="form-control-file"
          id="photo"
          onChange={(e) =>
            onInputChange("photo", e.target.files ? e.target.files[0] : null)
          }
        />
      </div>
      {serverError && <p className="text-danger">{serverError}</p>}
      <button type="submit" className="btn btn-primary w-100" style={{borderRadius : "50px"}}>
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
