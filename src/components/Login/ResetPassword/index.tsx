import { useState } from "react";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Icon from "@/components/Icon";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

type ResetPasswordProps = {
    handleSignIn: () => void;
};

const ResetPassword = ({ handleSignIn }: ResetPasswordProps) => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { requestPasswordReset } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await requestPasswordReset(email);
            setIsSubmitted(true);
            toast.success("Password reset email sent successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to send password reset email");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="check" className="w-8 h-8 text-green-600" />
                </div>
                
                {/* Success Message */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 text-t-primary">Email Sent!</h2>
                    <p className="text-gray-600">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button 
                        onClick={() => setIsSubmitted(false)}
                        className="w-full"
                        isGray
                    >
                        Resend Email
                    </Button>
                    <Button 
                        onClick={handleSignIn}
                        className="w-full"
                        isWhite
                    >
                        <Icon name="arrow-left" className="w-4 h-4 mr-2" />
                        Back to Sign In
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <p className="text-gray-600 text-sm">Enter your email to reset your password</p>
            </div>
            
            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field
                    innerLabel="Email Address"
                    placeholder="Enter your email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                    isBlack
                >
                    {isLoading ? (
                        <>
                            <Icon name="spinner" className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Send Reset Link"
                    )}
                </Button>
            </form>

            {/* Back to Sign In */}
            <div className="text-center">
                <button
                    className="inline-flex items-center text-sm text-primary-01 hover:text-primary-02 transition-colors"
                    onClick={handleSignIn}
                    disabled={isLoading}
                >
                    <Icon name="arrow-left" className="w-4 h-4 mr-1" />
                    Back to Sign In
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
