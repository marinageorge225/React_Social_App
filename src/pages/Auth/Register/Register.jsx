import { useForm } from "react-hook-form";

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

  // watch password
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
        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            style={inputStyle}
            {...register("name", {
              required: "Please enter your Full Name",

              minLength: {
                value: 3,
                message: "Characters should be more than 3",
              },

              maxLength: {
                value: 40,
                message: "Characters should be less than 40",
              },
            })}
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
            {...register("username", {
              required: "Username is required",

              minLength: {
                value: 5,
                message: "Username should be at least 5 characters",
              },

              maxLength: {
                value: 20,
                message: "Username should be less than 20 characters",
              },

              pattern: {
                value: /^[A-Za-z0-9_]+$/,
                message:
                  "Username can contain letters, numbers and underscore only",
              },
            })}
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
            {...register("email", {
              required: "Email is required",

              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: "Please enter a valid email",
              },
            })}
          />

          <p style={errorStyle}>{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Password</label>

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            {...register("password", {
              required: "Password is required",

              minLength: {
                value: 8,
                message: "Password should be at least 8 characters",
              },

              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                message:
                  "Password must contain uppercase, lowercase, number and special character",
              },
            })}
          />

          <p style={errorStyle}>{errors.password?.message}</p>
        </div>

        {/* RePassword */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Confirm Password</label>

          <input
            type="password"
            placeholder="Repeat password"
            style={inputStyle}
            {...register("rePassword", {
              required: "Please confirm your password",

              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

          <p style={errorStyle}>{errors.rePassword?.message}</p>
        </div>

        {/* Date Of Birth */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Date of Birth</label>

          <input
            type="date"
            style={inputStyle}
            {...register("dateOfBirth", {
              required: "Date of Birth is required",
            })}
          />

          <p style={errorStyle}>{errors.dateOfBirth?.message}</p>
        </div>

        {/* Gender */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Gender</label>

          <select
            style={inputStyle}
            {...register("gender", {
              required: "Gender is required",
            })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
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
