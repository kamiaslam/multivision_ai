"use client";

import Layout from "@/components/Layout";
import ProductView from "@/components/ProductView";
import Overview from "./Overview";
import ProductActivity from "./ProductActivity";
import Products from "./Products";

const OverviewPage = () => {
    return (
        <Layout title="Product overview">
            <div className="space-y-3 [&>*:last-child]:mb-0">
                <Overview />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    <div className="lg:col-span-7">
                        <ProductActivity />
                    </div>
                    <div className="lg:col-span-5">
                        <ProductView />
                    </div>
                </div>
                {/* <Products /> */}
            </div>
        </Layout>
    );
};

export default OverviewPage;
