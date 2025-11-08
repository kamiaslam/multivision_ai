import Link from "next/link";

type LogoProps = {
    className?: string;
};

const Logo = ({ className }: LogoProps) => {
    return (
        <Link 
            className={`flex relative h-auto w-auto min-w-[80px] justify-center items-center ${className || ""}`} 
            href="/"
        >
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Multivision
                </span>
                <span className="text-foreground dark:text-foreground ml-1">AI</span>
            </span>
        </Link>
    );
};

export default Logo;
