import { useState, useRef, useEffect } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Label,
} from "@headlessui/react";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import { SelectOption } from "@/types/select";

type FlexibleSelectOption = {
    id: string | number;
    name: string;
};

type SearchableSelectProps = {
    className?: string;
    classButton?: string;
    label?: string;
    tooltip?: string;
    value: FlexibleSelectOption | null;
    onChange: (value: FlexibleSelectOption) => void;
    options: FlexibleSelectOption[];
    isBlack?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    searchable?: boolean;
    maxHeight?: string;
};

const SearchableSelect = ({
    className,
    classButton,
    label,
    tooltip,
    value = null,
    onChange,
    options,
    isBlack,
    placeholder,
    searchPlaceholder = "Search...",
    searchable = true,
    maxHeight = "200px",
}: SearchableSelectProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search term
    const filteredOptions = searchable && searchTerm.trim()
        ? options.filter(option =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    const handleOptionSelect = (option: FlexibleSelectOption) => {
        onChange(option);
        setSearchTerm("");
    };

    // Clear search term when component unmounts or when selection changes
    useEffect(() => {
        return () => {
            setSearchTerm("");
        };
    }, [value]);

    return (
        <Listbox
            className={`${className || ""}`}
            value={value}
            onChange={handleOptionSelect}
            as="div"
        >
            {label && (
                <Label className="flex items-center mb-4">
                    <div className="text-button">{label}</div>
                    {tooltip && (
                        <Tooltip className="ml-1.5" content={tooltip} />
                    )}
                </Label>
            )}
            <ListboxButton
                className={`group flex justify-between items-center w-full h-12 pl-4.5 pr-3 border border-s-stroke2 rounded-3xl text-body-2 text-t-primary fill-t-secondary transition-all data-[hover]:border-s-highlight data-[hover]:text-t-primary data-[open]:text-t-primary data-[open]:rounded-b-none data-[open]:border-s-subtle data-[open]:border-b-transparent ${
                    isBlack
                        ? "bg-linear-to-b border-transparent from-[#2C2C2C] to-[#282828] !text-t-light !fill-t-light dark:from-shade-10 dark:to-[#DEDEDE]"
                        : ""
                } ${classButton || ""}`}
            >
                {value?.name ? (
                    <div className="truncate">{value.name}</div>
                ) : (
                    <div className="truncate text-t-secondary/50">
                        {placeholder}
                    </div>
                )}
                <Icon
                    className="shrink-0 ml-2 fill-inherit transition-transform group-[[data-open]]:rotate-180"
                    name="chevron"
                />
            </ListboxButton>
            <ListboxOptions
                className={`z-100 [--anchor-gap:-2px] w-[var(--button-width)] px-2.25 pb-2.25 bg-b-surface2 border border-t-0 border-s-subtle shadow-depth rounded-b-[1.25rem] origin-top transition duration-200 ease-out outline-none data-[closed]:scale-95 data-[closed]:opacity-0 ${
                    isBlack ? "!border-[#2C2C2C] pt-2" : ""
                }`}
                anchor="bottom"
                transition
            >
                {searchable && (
                    <div className="sticky top-0 pt-2 pb-2 border-b border-s-subtle mb-2">
                        <div className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={(e) => {
                                    // Focus the search input when dropdown opens
                                    setTimeout(() => {
                                        e.target.focus();
                                    }, 100);
                                }}
                                className="w-full pl-8 pr-3 py-2 text-sm bg-b-depth2 border border-s-stroke2 rounded-lg text-t-primary placeholder-t-secondary/50 focus:outline-none focus:border-s-highlight transition-colors"
                            />
                            <Icon
                                name="search"
                                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 fill-t-secondary/50"
                            />
                        </div>
                    </div>
                )}
                <div 
                    className="overflow-y-auto"
                    style={{ maxHeight }}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <ListboxOption
                                className="relative pl-2.25 py-2 pr-5.5 rounded-lg text-body-2 text-t-secondary cursor-pointer transition-colors after:absolute after:top-1/2 after:right-2.5 after:size-2 after:-translate-y-1/2 after:rounded-full after:bg-t-blue after:opacity-0 after:transition-opacity data-[focus]:text-t-primary data-[selected]:bg-shade-08/50 data-[selected]:text-t-primary data-[selected]:after:opacity-100 dark:data-[selected]:bg-shade-06/10"
                                key={option.id}
                                value={option}
                            >
                                {option.name}
                            </ListboxOption>
                        ))
                    ) : (
                        <div className="px-2.25 py-4 text-center text-sm text-t-secondary/50">
                            {searchTerm ? `No results found for "${searchTerm}"` : "No options available"}
                        </div>
                    )}
                </div>
                {searchable && filteredOptions.length > 0 && (
                    <div className="px-2.25 pt-2 border-t border-s-subtle text-xs text-t-secondary/50 text-center">
                        Showing {filteredOptions.length} of {options.length} options
                    </div>
                )}
            </ListboxOptions>
        </Listbox>
    );
};

export default SearchableSelect;
