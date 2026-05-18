import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { regSchema } from "../../../lib/ValidationSchemas/authSchema";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
const GRAD = "linear-gradient(135deg, #FF3366 0%, #FF6B9D 100%)";
const SHADOW = "0 8px 40px rgba(255,51,102,0.13)";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px",
  border: "1.5px solid #FFAEC9",
  borderRadius: 12,
  background: "#FFF7F9",
  outline: "none",
  fontSize: 14,
  color: "#3D1A28",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#C084A0",
  marginBottom: 4,
};

const errorStyle = {
  color: "red",
  fontSize: 12,
  marginTop: 4,
};

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(regSchema),

    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const password = watch("password");

  function onSubmit(data) {
    console.log(data);

    reset();
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 28,
          padding: "36px 32px",
          boxShadow: SHADOW,
        }}
      >
        {/* title and brand */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: GRAD,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: 12,
              boxShadow: "0 6px 18px rgba(255,51,102,.3)",
            }}
          >
            💬
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#2D0A1A",
              margin: 0,
            }}
          >
            Join{" "}
            <span
              style={{
                background: GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SocialApp
            </span>
          </h1>

          <p
            style={{
              color: "#C084A0",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            Create your account in seconds ✨
          </p>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg,transparent,#FFAEC9,transparent)",
              marginTop: 20,
            }}
          />
        </div>
        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            style={inputStyle}
            {...register("name")}
            // {...register("name", {
            //   required: "Please enter your Full Name",

            //   minLength: {
            //     value: 3,
            //     message: "Characters should be more than 3",
            //   },

            //   maxLength: {
            //     value: 40,
            //     message: "Characters should be less than 40",
            //   },
            // })}
          />

          <p style={errorStyle}>{errors.name?.message}</p>
        </div>

        {/* Username */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            style={inputStyle}
            {...register("username")}
            // {...register("username", {
            //   required: "Username is required",

            //   minLength: {
            //     value: 5,
            //     message: "Username should be at least 5 characters",
            //   },

            //   maxLength: {
            //     value: 20,
            //     message: "Username should be less than 20 characters",
            //   },

            //   pattern: {
            //     value: /^[A-Za-z0-9_]+$/,
            //     message:
            //       "Username can contain letters, numbers and underscore only",
            //   },
            // })}
          />

          <p style={errorStyle}>{errors.username?.message}</p>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email</label>

          <input
            type="email"
            placeholder="jane@example.com"
            style={inputStyle}
            {...register("email")}
            // {...register("email", {
            //   required: "Email is required",

            //   pattern: {
            //     value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            //     message: "Please enter a valid email",
            //   },
            // })}
          />

          <p style={errorStyle}>{errors.email?.message}</p>
        </div>

        {/* Password */}
        {/* Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Password</label>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              style={{
                ...inputStyle,
                paddingRight: 45,
              }}
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#C084A0",
                fontSize: 18,
              }}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <p style={errorStyle}>{errors.password?.message}</p>
        </div>

        {/* RePassword */}
        {/* RePassword */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Confirm Password</label>

          <div style={{ position: "relative" }}>
            <input
              type={showRePassword ? "text" : "password"}
              placeholder="Repeat password"
              style={{
                ...inputStyle,
                paddingRight: 45,
              }}
              {...register("rePassword")}
            />

            <button
              type="button"
              onClick={() => setShowRePassword(!showRePassword)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#C084A0",
                fontSize: 18,
              }}
            >
              {showRePassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <p style={errorStyle}>{errors.rePassword?.message}</p>
        </div>

        {/* Date Of Birth */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Date of Birth</label>

          <input
            type="date"
            style={inputStyle}
            {...register("dateOfBirth")}
            // {...register("dateOfBirth", {
            //   required: "Date of Birth is required",
            // })}
          />

          <p style={errorStyle}>{errors.dateOfBirth?.message}</p>
        </div>

        {/* Gender */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Gender</label>

          <select
            style={inputStyle}
            {...register("gender")}
            // {...register("gender", {
            //   required: "Gender is required",
            // })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <p style={errorStyle}>{errors.gender?.message}</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            background: GRAD,
            border: "none",
            borderRadius: 14,
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Create Account 🚀
        </button>
      </form>
    </div>
  );
}
