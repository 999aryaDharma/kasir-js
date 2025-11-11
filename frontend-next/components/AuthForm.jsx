import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ className, variant = "login", onSubmit, onInputChange, formState, errors, isLoading, ...props }) {
	const isLogin = variant === "login";

	const title = isLogin ? "Login to your account" : "Create an account";
	const description = isLogin ? "Enter your username and password below to login" : "Enter your username and password to get started";
	const buttonText = isLogin ? "Login" : "Sign Up";
	const linkText = isLogin ? "Don't have an account?" : "Already have an account?";
	const linkHref = isLogin ? "/sign-up" : "/login";
	const linkActionText = isLogin ? "Sign up" : "Login";

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-xl">{title}</CardTitle>
					<CardDescription className="mt-0.5 mb-2">{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="username">Username</Label>
								<Input id="username" name="username" type="text" placeholder="John Doe" required value={formState.username} onChange={onInputChange} />
								{errors?.username && <p className="text-xs text-red-500">{errors.username}</p>}
							</div>
							<div className="grid gap-3">
								{isLogin ? (
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
										{/* <Link href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
											Forgot your password?
										</Link> */}
									</div>
								) : (
									<Label htmlFor="password">Password</Label>
								)}
								<Input id="password" name="password" type="password" required value={formState.password} onChange={onInputChange} />
								{errors?.password && <p className="text-xs text-red-500">{errors.password}</p>}
							</div>
							{!isLogin && (
								<div className="grid gap-3">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<Input id="confirmPassword" name="confirmPassword" type="password" required value={formState.confirmPassword || ""} onChange={onInputChange} />
									{errors?.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
								</div>
							)}

							{errors?.api && <p className="text-sm text-red-600 text-center">{errors.api}</p>}
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Loading..." : buttonText}
								</Button>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							{linkText}{" "}
							<Link href={linkHref} className="underline underline-offset-4">
								{linkActionText}
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
