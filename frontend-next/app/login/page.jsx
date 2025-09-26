"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/form/auth-form";
import { loginUser } from "@/lib/api";

export default function Page() {
	const router = useRouter();
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
			const data = await loginUser(formState);
			// Simpan accessToken (misal di local storage atau context)
			localStorage.setItem("accessToken", data.accessToken);
			router.push("/dashboard"); // Redirect ke dashboard setelah login
		} catch (error) {
			setErrors({ api: error.message });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<AuthForm variant="login" onSubmit={handleLogin} onInputChange={handleInputChange} formState={formState} errors={errors} isLoading={isLoading} />
			</div>
		</div>
	);
}
