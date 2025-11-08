import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Icon from "@/components/Icon";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

type CreateAccountProps = {
  handleSignIn: () => void;
};

const CreateAccount = ({ handleSignIn }: CreateAccountProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/dashboard");
  const { signup, simSignup } = useAuth();
  const router = useRouter();

  // Get redirect parameter from URL without useSearchParams
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    if (redirect) {
      setRedirectTo(redirect);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await signup(
        formData.email,
        formData.email,
        formData.password,
        fullName
      );

      if (response && typeof response === "object" && "success" in response) {
        if (response.success) {
          setError("");
          toast.success(
            response.message || "Account created successfully! Please sign in.",
            { position: "top-right" }
          );
          simSignup(formData.email, formData.password, fullName);
          setTimeout(() => {
            handleSignIn();
          }, 1500);
        } else {
          setError(""); // Don't show error in red, only use toast
          toast.error(response.message || "Signup failed", {
            position: "top-right",
          });
        }
      } else {
        setError("Signup failed");
        toast.error("Signup failed", { position: "top-right" });
      }
    } catch (err: any) {
      setError(""); // Don't show error in red, only use toast
      toast.error(err.message || "Signup failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field
            innerLabel="First Name"
            placeholder="First name"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
          />
          <Field
            innerLabel="Last Name"
            placeholder="Last name"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
          />
        </div>

        <Field
          innerLabel="Email Address"
          placeholder="Enter email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-t-primary mb-2">
            Password
          </label>
          <div className="relative">
            <Field
              innerLabel=""
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-t-secondary hover:text-t-primary"
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-t-primary mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Field
              innerLabel=""
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-t-secondary hover:text-t-primary"
            >
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>

        {error && !loading && (
          // Only show error in red if not already showing in toast
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <Button type="submit" className="w-full" isBlack disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <span className="text-sm text-t-secondary">
          Already have an account?{" "}
        </span>
        <button
          className="text-sm text-t-primary hover:text-primary-01 font-medium"
          onClick={handleSignIn}
        >
          Sign in here
        </button>
      </div>
    </>
  );
};

export default CreateAccount;
