import React from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Switch from "@/components/Switch";

interface ResponsiveTableProps {
    headers: React.ReactNode;
    children: React.ReactNode;
    mobileCardRenderer?: (item: any, index: number) => React.ReactNode;
    data?: any[];
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
    headers,
    children,
    mobileCardRenderer,
    data = []
}) => {
    return (
        <>
            {/* Mobile Card Layout */}
            <div className="block lg:hidden space-y-4">
                {mobileCardRenderer ? (
                    data.map((item, index) => mobileCardRenderer(item, index))
                ) : (
                    <div className="text-center py-8 text-t-secondary">
                        Mobile view not configured for this table.
                    </div>
                )}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden lg:block">
                <div className="overflow-x-auto">
                    <Table cellsThead={headers}>
                        {children}
                    </Table>
                </div>
            </div>
        </>
    );
};

export default ResponsiveTable;
