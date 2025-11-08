import { useState } from "react";
import Search from "@/components/Search";
import Tabs from "@/components/Tabs";
import NoFound from "@/components/NoFound";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Market from "./Market";
import ProductsStatistics from "./ProductsStatistics";
import { ProductMarket } from "@/types/product";

import {
    products,
    productsTrafficSources,
    productsViewers,
} from "@/mocks/products";

const categories = [
    { id: 1, name: "Market" },
    { id: 2, name: "Traffic sources" },
    { id: 3, name: "Viewers" },
];

const Products = ({}) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [visibleSearch, setVisibleSearch] = useState(false);

    return (
        <div className="card">
            <div className="flex items-center max-lg:flex-wrap">
                <div className="flex items-center min-h-12 pl-5 text-h6 max-lg:mr-6 max-lg:pl-3 max-md:mr-auto">
                    All customers
                </div>
                <Button
                    className="!hidden mr-auto max-lg:!flex max-md:mr-4 max-md:size-6 max-md:border-none"
                    icon={visibleSearch ? "close" : "search"}
                    onClick={() => setVisibleSearch(!visibleSearch)}
                    isStroke
                    isCircle
                />
                <Search
                    className={`w-70 ml-6 mr-auto max-lg:w-full max-lg:order-4 max-lg:mt-3 max-lg:mx-4 max-md:mx-3 ${
                        visibleSearch ? "max-lg:block" : "max-lg:hidden"
                    }`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers"
                    isGray
                />
                <Dropdown
                    className="hidden max-md:block"
                    items={categories}
                    value={category}
                    setValue={setCategory}
                />
                {search === "" && (
                    <Tabs
                        className="max-md:hidden"
                        items={categories}
                        value={category}
                        setValue={setCategory}
                    />
                )}
            </div>
            {search !== "" ? (
                <NoFound title="No products found" />
            ) : (
                <div className="pt-3 px-1 pb-5 max-lg:px-0 max-lg:pb-0">
                    {category.id === 1 && (
                        <Market items={products} />
                    )}
                    {category.id === 2 && (
                        <ProductsStatistics items={productsTrafficSources} />
                    )}
                    {category.id === 3 && (
                        <ProductsStatistics
                            items={productsViewers}
                            isViewers
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;
