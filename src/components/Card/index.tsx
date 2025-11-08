import Select from "@/components/Select";

type CardProps = {
    className?: string;
    classHead?: string;
    title?: string;
    children: React.ReactNode;
    selectOptions?: { id: number; name: string }[];
    selectValue?: {
        id: number;
        name: string;
    };
    selectOnChange?: (value: { id: number; name: string }) => void;
    headContent?: React.ReactNode;
    style?: React.CSSProperties;
};

const Card = ({
    className,
    classHead,
    title,
    selectOptions,
    selectValue,
    selectOnChange,
    children,
    headContent,
    style,
}: CardProps) => {
    const hasHeader = title || headContent || (selectOptions && selectValue && selectOnChange);
    
    return (
        <div className={`card ${className || ""}`} style={style}>
            {hasHeader && (
                <div
                    className={`flex items-center h-12 ${
                        classHead || ""
                    }`}
                >
                    {title && <div className="mr-auto text-h6">{title}</div>}
                    {headContent}
                    {selectOptions && selectValue && selectOnChange && (
                        <Select
                            className="min-w-40 max-md:min-w-34"
                            value={selectValue}
                            onChange={selectOnChange}
                            options={selectOptions}
                        />
                    )}
                </div>
            )}
            <div className={hasHeader ? "pt-3" : ""}>{children}</div>
        </div>
    );
};

export default Card;
