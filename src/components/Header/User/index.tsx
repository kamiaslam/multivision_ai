import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    MenuSeparator,
} from "@headlessui/react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { useAuth } from "@/context/authContext";
import { navigationUser } from "@/contstants/navigation";

// Custom Loader Component
interface LoaderProps {
  showText?: boolean;
  text?: string;
  className?: string;
}

function Loader({ 
  showText = false, 
  text = "Loading...",
  className = ""
}: LoaderProps) {
  return (
    <div className={`text-center space-y-2 ${className}`}>
      {/* Modern animated loader */}
      <div className="relative mx-auto" style={{ width: '3rem', height: '3rem' }}>
        {/* Outer ring */}
        <div className="w-12 h-12 border-3 border-gray-200 dark:border-gray-600 rounded-full animate-pulse"></div>
        
        {/* Primary ring with gradient */}
        <div className="absolute top-0 left-0 w-12 h-12 border-3 border-transparent border-t-primary-01 rounded-full animate-spin"></div>
        
        {/* Secondary accent ring - perfectly centered */}
        <div 
          className="absolute w-10 h-10 border-3 border-transparent border-b-primary-02 rounded-full animate-spin" 
          style={{ 
            animationDirection: 'reverse', 
            animationDuration: '1.5s',
            top: '1px',
            left: '1px'
          }}
        ></div>
        
        {/* Center dot */}
        <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-primary-01 rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Loading text with modern typography */}
      {showText && (
        <div className="space-y-1">
          <p className="text-xs text-t-secondary font-mono">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}

const User = ({}) => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const isActive = (href: string) => pathname === href;

    const handleLogout = async () => {
        try {
            await logout();
            // The logout function will handle clearing tokens and redirecting
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Get user initials from full_name or username
    const getUserInitials = () => {
        if (user?.full_name) {
            const names = user.full_name.split(' ');
            if (names.length >= 2) {
                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
            }
            return names[0][0].toUpperCase();
        }
        if (user?.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return 'U';
    };

    // Get display name
    const getDisplayName = () => {
        return user?.full_name || user?.username || 'User';
    };

    // Show loader while user data is being fetched
    if (!user) {
        return (
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                <Loader showText={false} className="scale-75" />
            </div>
        );
    }

    return (
        <Menu className="group" as="div">
            <div className="fixed inset-0 z-30 bg-b-surface1/70 invisible opacity-0 transition-all group-[[data-open]]:visible group-[[data-open]]:opacity-100"></div>
            <MenuButton className="relative z-40 w-12 h-12 rounded-full overflow-hidden transition-colors after:absolute after:inset-[0.09375rem] after:border-[0.15625rem] after:border-b-surface2 after:rounded-full data-[hover]:bg-primary-01 data-[active]:bg-primary-01">
                {user?.avatar_url ? (
                    <Image
                        className="size-10 rounded-full object-cover opacity-100"
                        src={user.avatar_url}
                        width={40}
                        height={40}
                        alt={`${getDisplayName()}'s avatar`}
                        priority={true}
                        quality={100}
                    />
                ) : (
                    <div className="size-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-semibold text-sm shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:bg-primary-02 dark:hover:bg-primary-01">
                        {getUserInitials()}
                    </div>
                )}
            </MenuButton>
            <MenuItems
                className="z-100 w-67.5 p-3 rounded-4xl bg-b-surface2 border-1 border-s-subtle outline-none shadow-dropdown [--anchor-gap:0.625rem] [--anchor-offset:0.625rem] origin-top transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 max-md:w-[calc(100vw-1.5rem)] max-md:[--anchor-offset:0]"
                anchor="bottom end"
                transition
            >
                {/* User Info Header */}
                <div className="px-3 py-2 mb-2 border-b border-s-subtle">
                    <div className="text-sm font-medium text-t-primary">{getDisplayName()}</div>
                    <div className="text-xs text-t-secondary">{user?.email}</div>
                </div>
                
                {navigationUser.map((link) => (
                    <MenuItem key={link.href}>
                        <Link
                            className={`group/item relative flex items-center h-12 px-3 text-button text-t-secondary transition-colors data-[focus]:text-t-primary before:absolute before:inset-0 before:rounded-[16px] before:bg-linear-to-b before:from-shade-09 before:to-[#ebebeb] before:opacity-0 before:transition-opacity after:absolute after:inset-0.25 after:bg-b-pop after:rounded-[15px] after:opacity-0 after:transition-opacity ${
                                link.title === "Upgrade to Pro"
                                    ? "!text-primary-01"
                                    : ""
                            } ${
                                isActive(link.href)
                                    ? "!text-t-primary before:opacity-100 after:opacity-100 dark:before:opacity-[0.075]"
                                    : ""
                            }`}
                            href={link.href}
                        >
                            <Icon
                                className={`relative z-2 mr-4 fill-t-secondary transition-colors group-[[data-focus]]/item:fill-t-primary ${
                                    link.title === "Upgrade to Pro"
                                        ? "!fill-primary-01"
                                        : ""
                                } ${
                                    isActive(link.href)
                                        ? "!fill-t-primary"
                                        : ""
                                }`}
                                name={link.icon}
                            />
                            <div className="relative z-2">{link.title}</div>
                        </Link>
                    </MenuItem>
                ))}
                <MenuSeparator className="-mx-3 my-3 h-px bg-s-subtle" />
                <MenuItem>
                    <button
                        className="group/item flex items-center w-full h-12 px-3 text-button text-t-secondary transition-colors data-[focus]:text-t-primary hover:text-red-500"
                        onClick={handleLogout}
                    >
                        <Icon
                            className="mr-4 fill-t-secondary transition-colors group-[[data-focus]]/item:fill-t-primary group-hover:fill-red-500"
                            name="logout"
                        />
                        Log out
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
};

export default User;
