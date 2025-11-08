import { NumericFormat } from "react-number-format";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableProductCell from "@/components/TableProductCell";
import Percentage from "@/components/Percentage";
import Icon from "@/components/Icon";
import DeleteItems from "@/components/DeleteItems";
import ShareProduct from "@/components/ShareProduct";
import { ProductMarket } from "@/types/product";

const tableHead = ["Customer", "Status", "Price", "Plan", "No of calls"];

type MarketProps = {
    items: ProductMarket[];
};



const Market = ({ items }: MarketProps) => {
    const router = useRouter();

    const handleEdit = () => {
        router.push('/customers');
    };

    return (
        <Table
            cellsThead={tableHead.map((head) => (
                <th
                    className="max-lg:nth-5:hidden max-lg:nth-6:hidden max-lg:nth-7:hidden"
                    key={head}
                >
                    {head}
                </th>
            ))}
        >
            {items.map((item) => (
                <TableRow key={item.id}>
                    <TableProductCell
                        title={item.title}
                        details={item.details}
                        image={item.image}
                        mobileContent={
                            <>
                                <NumericFormat
                                    className="min-w-13 mr-2"
                                    value={item.price}
                                    thousandSeparator=","
                                    decimalScale={2}
                                    fixedDecimalScale
                                    displayType="text"
                                    prefix="$"
                                />
                                <span className="text-sm text-gray-600">{item.plan || "Basic"}</span>
                            </>
                        }
                    >
                        <button className="action" onClick={handleEdit}>
                            <Icon name="edit" />
                            Edit
                        </button>
                        <DeleteItems onDelete={() => {}} />
                        <ShareProduct
                            title={item.title}
                            details={item.details}
                            image={item.image}
                        />
                    </TableProductCell>
                    <td className="max-md:hidden">
                        <div
                            className={`inline-flex items-center h-7 px-1.75 rounded-lg border text-button leading-none capitalize ${
                                item.active ? "label-green" : "label-red"
                            }`}
                        >
                            {item.active ? "Active" : "Offline"}
                        </div>
                    </td>
                    <td className="max-md:hidden">
                        <NumericFormat
                            value={item.price}
                            thousandSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            displayType="text"
                            prefix="$"
                        />
                    </td>
                    <td className="max-lg:hidden">
                        <span className="text-sm font-medium text-gray-700">
                            {item.plan || "Basic"}
                        </span>
                    </td>
                    <td className="max-lg:hidden">
                        <span className="text-sm font-medium text-gray-700">
                            {item.calls || item.sales?.value || "0"}
                        </span>
                    </td>
                </TableRow>
            ))}
        </Table>
    );
};

export default Market;
