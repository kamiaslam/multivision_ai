import { useState } from "react";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Icon from "@/components/Icon";

type SignInProps = {
    handleSignUp: () => void;
    handleForgotPassword: () => void;
    onLogin: (username: string, password: string) => Promise<void>;
};

const SignIn = ({ handleSignUp, handleForgotPassword, onLogin }: SignInProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await onLogin(email, password);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Field
                    innerLabel="Email"
                    placeholder="Enter email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            handleForgotPassword={handleForgotPassword}
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
                <Button type="submit" className="w-full" isBlack disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </Button>
            </form>
            
            <div className="mt-4 text-center text-body-2 text-t-secondary">
                Need an account?&nbsp;
                <button
                    className="text-t-primary font-bold transition-colors hover:text-primary-01"
                    onClick={handleSignUp}
                >
                    Sign up
                </button>
            </div>
        </>
    );
};

export default SignIn;
