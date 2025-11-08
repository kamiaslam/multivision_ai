import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "@/components/Image";
import Logo from "@/components/Logo";
import ThemeButton from "@/components/ThemeButton";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";
import ResetPassword from "./ResetPassword";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

const Login = ({}) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const [redirectTo, setRedirectTo] = useState('/dashboard');

    // Get redirect parameter from URL without useSearchParams
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (redirect) {
            setRedirectTo(redirect);
        }
    }, []);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    if (isAuthenticated) {
        return null;
    }

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await login(username, password);
            
            if (response.success) {
                toast.success("Login successful!", {
                    position: "top-right"
                });
                
                // Redirect to intended destination after successful login
                setTimeout(() => {
                    router.push(redirectTo);
                }, 1000);
            } else {
                toast.error(response.message || "Login failed", {
                    position: "top-right"
                });
            }
        } catch (error: any) {
            toast.error(error.message || "Login failed", {
                position: "top-right"
            });
        }
    };

    return (
        <div className="min-h-screen bg-b-surface1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Logo className="w-auto h-12" />
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-b-surface2 py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-b-border">
                    <div className="mb-10 text-h4 text-center max-md:mb-6 max-md:text-h5 text-t-primary">
                        {isResetPassword
                            ? "Reset password"
                            : isSignIn
                            ? "Sign in to Dashboard"
                            : "Create an account"}
                    </div>
                    
                    {isResetPassword ? (
                        <ResetPassword
                            handleSignIn={() => {
                                setIsSignIn(true);
                                setIsResetPassword(false);
                            }}
                        />
                    ) : (
                        <>
                            <Button className="w-full gap-2" isGray>
                                <Image
                                    className="size-6 opacity-100"
                                    src="/images/google.svg"
                                    width={24}
                                    height={24}
                                    alt="Google"
                                />
                                Sign {isSignIn ? "in" : "up"} with Google
                            </Button>
                            <div className="mt-6 text-center text-caption text-t-tertiary">
                                {isSignIn
                                    ? "Or sign in with email"
                                    : "Or use your email"}
                            </div>
                            {isSignIn ? (
                                <SignIn
                                    handleSignUp={() => setIsSignIn(false)}
                                    handleForgotPassword={() =>
                                        setIsResetPassword(true)
                                    }
                                    onLogin={handleLogin}
                                />
                            ) : (
                                <CreateAccount handleSignIn={() => setIsSignIn(true)} />
                            )}
                        </>
                    )}
                    
                    {/* Theme Toggle */}
                    <div className="mt-6 flex justify-center">
                        <ThemeButton className="flex-row w-22 shadow-lg border"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
