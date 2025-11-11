"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { signUpUser } from "@/lib/api";

export default function Page() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validasi: Cek apakah password dan confirm password sama
    if (formState.password !== formState.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      setIsLoading(false);
      return;
    }

    try {
      // Kirim hanya username dan password ke API
      await signUpUser({
        username: formState.username,
        password: formState.password,
      });
      // Redirect ke halaman login setelah berhasil sign up
      alert("Sign up successful! Please login."); // Optional: beri notifikasi
      router.push("/login");
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm
          variant="signup"
          onSubmit={handleSignUp}
          onInputChange={handleInputChange}
          formState={formState}
          errors={errors}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
