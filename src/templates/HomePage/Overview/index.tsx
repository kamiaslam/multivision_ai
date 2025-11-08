import { useState } from "react";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Percentage from "@/components/Percentage";
import NewCustomers from "@/components/NewCustomers";
import Balance from "./Balance";
import { revenueData, users } from "@/lib/data";

const durations = [
    { id: 1, name: "Last 7 days" },
    { id: 2, name: "Last month" },
    { id: 3, name: "Last year" },
];

// Calculate metrics from real data
const totalUsers = users.length;
const activeUsers = users.filter(u => u.status === "active").length;
const totalMRR = users.reduce((sum, user) => sum + user.mrr, 0);
const currentRevenue = revenueData[revenueData.length - 1];
const previousRevenue = revenueData[revenueData.length - 2];
const revenueGrowth = previousRevenue ? ((currentRevenue.mrr - previousRevenue.mrr) / previousRevenue.mrr) * 100 : 0;

const tabs = [
    {
        id: 1,
        icon: "profile",
        label: "Active Users",
        value: activeUsers.toString(),
        percent: 12.5, // Mock growth percentage
    },
    {
        id: 2,
        icon: "wallet",
        label: "MRR",
        value: `$${(totalMRR / 1000).toFixed(1)}k`,
        percent: revenueGrowth,
    },
];

const Overview = ({}) => {
    const [duration, setDuration] = useState(durations[0]);
    const [activeTab, setActiveTab] = useState(1);

    return (
        <Card
            title="Overview"
            selectValue={duration}
            selectOnChange={setDuration}
            selectOptions={durations}
        >
            <div className="pt-1">
                <div className="flex mb-4 p-1.5 border border-s-subtle rounded-4xl bg-b-depth2">
                    {tabs.map((tab) => (
                        <div
                            className={`group flex-1 px-12 py-8 rounded-3xl cursor-pointer transition-all max-2xl:p-6 max-xl:pr-3 max-md:p-4 ${
                                activeTab === tab.id
                                    ? "bg-b-surface2 shadow-depth-toggle"
                                    : ""
                            }`}
                            key={tab.label}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <div
                                className={`flex items-center gap-3 mb-2 text-sub-title-1 transition-colors group-hover:text-t-primary max-md:mb-3 max-md:text-sub-title-2 ${
                                    activeTab === tab.id
                                        ? "text-t-primary"
                                        : "text-t-secondary"
                                }`}
                            >
                                <Icon
                                    className={`transition-colors group-hover:fill-t-primary ${
                                        activeTab === tab.id
                                            ? "fill-t-primary"
                                            : "fill-t-secondary"
                                    }`}
                                    name={tab.icon}
                                />
                                <div className="">{tab.label}</div>
                            </div>
                            <div className="flex items-center gap-4 max-md:flex-col max-md:items-stretch max-md:gap-1">
                                <div className="text-h2 max-md:text-h3">
                                    {tab.value}
                                </div>
                                <div>
                                    <Percentage value={tab.percent} />
                                    <div className="mt-1 text-body-2 text-t-secondary max-md:text-caption">
                                        vs last month
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {activeTab === 1 && (
                    <NewCustomers className="p-5 max-lg:px-3 max-lg:py-4" />
                )}
                {activeTab === 2 && <Balance />}
            </div>
        </Card>
    );
};

export default Overview;
