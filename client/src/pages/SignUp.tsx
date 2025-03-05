import { useState } from "react";
import SignUpForm from "../components/SignUpForm";

export type SignUpData = {
  username: string;
  password: string;
  email: string;
  photo?: File[] | null;
};

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    password: "",
    email: "",
    photo: null,
  });

  const handleInputChange = (
    field: keyof SignUpData,
    value: string | File | null
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div
        className="card p-4"
        style={{ width: "400px", height: "650px", borderRadius: "50px" }}
      >
        <div className="text-center">
          <img
            src="/src/assets/logo.png"
            alt="SumMate Logo"
            style={{ width: "60px", height: "60px" }}
          /><div>
            <img
              src="/src/assets/SumMate Text.png"
              alt="SumMate Logo"
              style={{ width: "250px" }}
            />
          </div>
          <p className="text-muted">Sign Up</p>
        </div>
        <SignUpForm formData={formData} onInputChange={handleInputChange} />
        <p className="text-center my-1">
          Already have an account?{" "}
          <a href="/" className="text-success">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
