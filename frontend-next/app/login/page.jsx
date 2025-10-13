"use client";

import { useState } from "react";
import { AuthForm } from "@/components/form/auth-form";
import { loginUser } from "@/lib/api";
import { handleAuthSuccess } from "@/lib/authUtils";

export default function Page() {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      console.log("Login attempt with:", formState);
      const data = await loginUser(formState);
      console.log("Login success, data:", data);

      if (!data || !data.accessToken) {
        console.error("No access token in response");
        console.log("Full response data:", data);
        throw new Error("Login failed: No access token received");
      }

      handleAuthSuccess(data);
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ api: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm
          variant="login"
          onSubmit={handleLogin}
          onInputChange={handleInputChange}
          formState={formState}
          errors={errors}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
