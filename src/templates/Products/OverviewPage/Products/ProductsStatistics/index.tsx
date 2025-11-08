import { NumericFormat } from "react-number-format";
import millify from "millify";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableProductCell from "@/components/TableProductCell";
import Percentage from "@/components/Percentage";
import Icon from "@/components/Icon";
import DeleteItems from "@/components/DeleteItems";
import ShareProduct from "@/components/ShareProduct";
import Legend from "./Legend";
import ProgressBar from "./ProgressBar";
import { ProductStatistics } from "@/types/product";

type ProductsStatisticsProps = {
    items: ProductStatistics[];
    isViewers?: boolean;
};

const ProductsStatistics = ({
    items,
    isViewers,
}: ProductsStatisticsProps) => {
    const router = useRouter();

    const handleEdit = () => {
        router.push('/customers');
    };

    return (
        <>
            <Legend
                className="hidden pt-2 px-3 max-lg:flex max-md:pb-2"
                data={items[0].trafficSource}
            />
            <Table
                cellsThead={
                    <>
                        <th>Product</th>
                        <th>{isViewers ? "Views" : "Impressions"}</th>
                        <th className="max-lg:hidden">
                            <div className="inline-flex items-center w-full">
                                {isViewers ? "Viewers" : "Traffic source"}
                                <Legend
                                    className="max-lg:hidden"
                                    data={items[0].trafficSource}
                                />
                            </div>
                        </th>
                    </>
                }
            >
                {items.map((item) => (
                    <TableRow
                        className="max-md:flex max-md:flex-col"
                        key={item.id}
                    >
                        <TableProductCell
                            title={item.title}
                            details={item.details}
                            image={item.image}
                            mobileContent={
                                <div className="inline-flex items-center gap-2">
                                    <div className="min-w-13">
                                        {item.value < 9999 ? (
                                            <NumericFormat
                                                value={item.value}
                                                thousandSeparator=","
                                                fixedDecimalScale
                                                displayType="text"
                                            />
                                        ) : (
                                            millify(item.value, {
                                                lowercase: true,
                                            })
                                        )}
                                    </div>
                                    <Percentage value={item.percentage} />
                                </div>
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
                            <div className="inline-flex items-center gap-2">
                                <div className="min-w-13">
                                    {item.value < 9999 ? (
                                        <NumericFormat
                                            value={item.value}
                                            thousandSeparator=","
                                            fixedDecimalScale
                                            displayType="text"
                                        />
                                    ) : (
                                        millify(item.value, {
                                            lowercase: true,
                                        })
                                    )}
                                </div>
                                <Percentage value={item.percentage} />
                            </div>
                        </td>
                        <td className="max-lg:hidden">
                            <ProgressBar
                                data={item.trafficSource}
                                percentage={item.percentage}
                            />
                        </td>
                    </TableRow>
                ))}
            </Table>
        </>
    );
};

export default ProductsStatistics;
