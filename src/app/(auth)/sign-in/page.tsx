"use client";

import React, { useState } from 'react'
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, LoaderIcon, ReceiptRussianRuble } from "lucide-react";

const SignInPage = () => {

    const { isLoaded, signIn, setActive } = useSignIn();

    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        if (!email || !password) {
            return toast.warning("Please fill in all fields");
        }

        setIsLoading(true);

        try {
            const signInAttempt = await signIn.create({
                identifier: email,
                password,
                redirectUrl: "/auth-callback",
            });

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                router.push("/auth-callback");
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
                toast.error("Invalid email or password");
            }
        } catch (error: any) {
            console.error(JSON.stringify(error, null, 2));

            switch (error.errors[0]?.code) {
                case "form_identifier_not_found":
                    toast.error("This email is not registered. Please sign up first.")
                case "form_password_incorrect":
                    toast.error("Incorrect password. Please try again.")
                case "too_many_attempts":
                    toast.error("Too many attempts. Please try again later.")
                default:
                    toast.error("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center hc gap-y-6">
            <h1 className="text-2xl font-bold">
                Sign in
            </h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        disabled={isLoading}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <div className="relative w-full">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            disabled={isLoading}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            disabled={isLoading}
                            className="absolute top-1 right-1"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <Button
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? (
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : "Sign In"}
                </Button>
                <div className="flex">
                    <p className="text-sm text-muted-foreground text-center w-full">
                        Don&apos;t have an account? <Link href="/sign-up" className="text-foreground">Sign up</Link>
                    </p>
                </div>
            </form>
        </div>
    )
};

export default SignInPage
