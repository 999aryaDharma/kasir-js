import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Login to your account</CardTitle>
					<CardDescription className="mt-0.5 mb-2">Enter your username and password below to login</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">Username</Label>
								<Input id="username" type="text" placeholder="John Doe" required />
							</div>
							<div className="grid gap-3">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
										Forgot your password?
									</a>
								</div>
								<Input id="password" type="password" required />
							</div>
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full">
									Login
								</Button>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<a href="#" className="underline underline-offset-4">
								Sign up
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
