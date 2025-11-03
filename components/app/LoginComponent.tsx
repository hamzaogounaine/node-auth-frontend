"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import api from "@/lib/api"; // Assuming your configured Axios instance
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation"; // 🌟 FIX 1: Import useRouter for redirection

// 🌟 Define a more specific type for error state
// This structure handles both the specific field errors and the generic invalid credentials error
const initialErrors = {
  general: null, // For messages like "Invalid credentials"
  fields: { email: null, password: null }, // For validation messages
};

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 🌟 FIX 2: Initialize errors with the specific structure
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(initialErrors); // Clear previous errors on new submission

    try {
      // 🌟 FIX 3: Axios call should be correct here, posting { email, password }
      const res = await api.post("/login", { email, password });
      
      console.log(res);
      localStorage.setItem("accessToken", res.data.accessToken);
      
      // 🌟 FIX 4: Redirect upon successful login
      router.push("/dashboard"); 

    } catch (err) {
      console.error("Login Error:", err);
      
      // 🌟 FIX 5: Process the error structure from the backend (err.response.data)
      if (err.response && err.response.data) {
        const backendError = err.response.data.errors;

        if (typeof backendError === 'string') {
          // Case 1: Generic invalid credentials error (e.g., "errors.invalidCredentials")
          setErrors({ ...initialErrors, general: backendError });
        } else if (typeof backendError === 'object') {
          // Case 2: Structured validation errors (e.g., { email: "required", password: "minlength" })
          setErrors({ ...initialErrors, fields: backendError });
        }
      } else {
        // Case 3: Network or unknown error
        setErrors({ ...initialErrors, general: "An unexpected error occurred." });
      }

    } finally {
      // Execute regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 ">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email below to login to your account
          
          {/* 🌟 FIX 6: Display the general error message */}
          {errors.general && (
            <span className="text-red-500 block">
              {errors.general === "errors.invalidCredentials" ? "Invalid credentials" : errors.general}
            </span>
          )}
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* 🌟 FIX 7: Display field-specific error */}
          {errors.fields.email && (
            <p className="text-sm text-red-500">
              {errors.fields.email.includes("required") ? "Email is required." : errors.fields.email}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
           {/* 🌟 FIX 7: Display field-specific error */}
          {errors.fields.password && (
            <p className="text-sm text-red-500">
              {errors.fields.password.includes("required") ? "Password is required." : errors.fields.password}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex gap-2 items-center justify-center">
              Loading <Loader className="animate-spin h-4 w-4" />
            </span>
          ) : (
            "Login"
          )}
        </Button>
        <Button variant="outline" className="w-full" disabled={loading}>
          Login with Google
        </Button>
        <Link
          href="#"
          className="inline-block w-full text-center text-sm underline"
          prefetch={false}
        >
          Forgot your password?
        </Link>
      </form>
    </div>
  );
}