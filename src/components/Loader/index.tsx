interface LoaderProps {
  showText?: boolean;
  text?: string;
  className?: string;
}

export default function Loader({ 
  showText = true, 
  text = "Please wait while we prepare your experience",
  className = ""
}: LoaderProps) {
  return (
    <>
      <div className={`text-center space-y-6 ${className}`}>
        {/* Modern animated loader */}
        <div className="relative mx-auto" style={{ width: '4rem', height: '4rem' }}>
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-pulse"></div>
          
          {/* Primary ring with gradient */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary-01 rounded-full animate-spin"></div>
          
          {/* Secondary accent ring - perfectly centered */}
          <div 
            className="absolute w-14 h-14 border-4 border-transparent border-b-primary-02 rounded-full animate-spin" 
            style={{ 
              animationDirection: 'reverse', 
              animationDuration: '1.5s',
              top: '2px',
              left: '2px'
            }}
          ></div>
          
          {/* Center dot */}
          <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary-01 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Loading text with modern typography */}
        {showText && (
          <div className="space-y-2">
            <h3 className="text-h4 font-semibold text-t-primary font-mono">
              Loading
            </h3>
            <p className="text-body-2 text-t-secondary font-mono">
              {text}
            </p>
          </div>
        )}
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-01 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary-02 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary-04 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </>
  );
}
