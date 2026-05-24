import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../lib/ValidationSchemas/authSchema";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useContext, useState } from "react";
import { loginUser } from "../../../services/authServices";
import { Alert } from "@heroui/react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../../context/AuthContext";

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

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const response = await loginUser(data);

      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        setToken(response.data.data.token);
      }

      setSuccessMessage(response.data.message || "Login Successful 🎉");
      setErrorMessage("");
      reset();
      navigate("/");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password",
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Nunito', 'Poppins', 'Segoe UI', sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 28,
          padding: "40px 32px",
          boxShadow: SHADOW,
        }}
      >
        {/* Success Alert */}
        {successMessage && (
          <Alert
            color="success"
            title={successMessage}
            variant="flat"
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Error Alert */}
        {errorMessage && (
          <Alert
            color="danger"
            title={errorMessage}
            variant="flat"
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Brand */}
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
              fontSize: 30,
              marginBottom: 12,
              boxShadow: "0 8px 22px rgba(255,51,102,.3)",
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
            Welcome back to{" "}
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
              margin: "6px 0 0",
            }}
          >
            Sign in to reconnect with your world 🌸
          </p>
        </div>

        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#FFAEC9,transparent)",
            marginBottom: 24,
          }}
        />

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email</label>

          <input
            type="email"
            placeholder="jane@example.com"
            style={inputStyle}
            {...register("email")}
          />

          <p style={errorStyle}>{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Password</label>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
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

        {/* Remember / Forgot */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#C084A0",
              cursor: "pointer",
            }}
          >
            <input type="checkbox" style={{ accentColor: "#FF3366" }} />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#FF3366",
              textDecoration: "none",
            }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            background: GRAD,
            border: "none",
            borderRadius: 14,
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(255,51,102,.35)",
            letterSpacing: "0.03em",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Signing In..." : "Sign In ✨"}
        </button>

        {/* OR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "22px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#FFE4EC" }} />

          <span
            style={{
              color: "#FFAEC9",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            or continue with
          </span>

          <div style={{ flex: 1, height: 1, background: "#FFE4EC" }} />
        </div>

        {/* Social Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {["Google", "Apple", "Facebook"].map((name) => (
            <button
              key={name}
              type="button"
              style={{
                flex: 1,
                padding: "10px 0",
                background: "#FFF7F9",
                border: "1.5px solid #FFAEC9",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                color: "#C084A0",
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Register Link */}
        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#C084A0",
            margin: 0,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#FF3366",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Sign Up →
          </Link>
        </p>
      </form>
    </div>
  );
}
