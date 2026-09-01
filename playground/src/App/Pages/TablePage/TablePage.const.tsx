import type { TableColumn } from "@thewaver/ss-components";

import { PageTableCellContent, PageTableHeaderContent } from "../../StyledComponents/TableContent/TableContent";
import type { Part, PartColumnDefs } from "./TablePage.types";

export const STRESS_PART_COUNT = 50000;

const PENCE_PER_POUND = 100;

const CATEGORIES = ["Fastener", "Bearing", "Gasket", "Housing", "Spring", "Bracket"];

const formatPrice = (pricePence: number) =>
    `£${(pricePence / PENCE_PER_POUND).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;

export const PARTS: Part[] = [
    { sku: "FS-1042", name: "Hex bolt M6", category: "Fastener", stock: 1840, pricePence: 12 },
    { sku: "BR-2201", name: "Deep groove 608", category: "Bearing", stock: 96, pricePence: 445 },
    { sku: "GK-3310", name: "Copper washer 14mm", category: "Gasket", stock: 0, pricePence: 38 },
    { sku: "HS-4001", name: "Gearbox shell", category: "Housing", stock: 12, pricePence: 18950 },
    { sku: "SP-5120", name: "Compression 40mm", category: "Spring", stock: 340, pricePence: 89 },
    { sku: "BK-6015", name: "L bracket 90°", category: "Bracket", stock: 217, pricePence: 156 },
    { sku: "FS-1077", name: "Wing nut M8", category: "Fastener", stock: 728, pricePence: 24 },
    { sku: "BR-2290", name: "Thrust 51100", category: "Bearing", stock: 41, pricePence: 1210 },
    { sku: "GK-3388", name: "Nitrile O-ring 22mm", category: "Gasket", stock: 1502, pricePence: 15 },
    { sku: "HS-4090", name: "Pump end cap", category: "Housing", stock: 7, pricePence: 6425 },
    { sku: "SP-5199", name: "Torsion 12mm", category: "Spring", stock: 88, pricePence: 233 },
    { sku: "BK-6077", name: "Shelf rail 300mm", category: "Bracket", stock: 63, pricePence: 812 },
];

export const createStressParts = (): Part[] =>
    Array.from({ length: STRESS_PART_COUNT }, (_, index) => ({
        sku: `PT-${String(index).padStart(6, "0")}`,
        name: `Part ${index.toLocaleString("en-GB")}`,
        category: CATEGORIES[index % CATEGORIES.length],
        stock: (index * 37) % 2000,
        pricePence: ((index * 197) % 25000) + 10,
    }));

export const createPartColumns = (defs: PartColumnDefs): TableColumn<Part>[] => [
    {
        id: "sku",
        header: "SKU",
        widthPx: 110,
        minWidthPx: 80,
        maxWidthPx: 260,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.sku.localeCompare(b.sku),
        renderHeader: (getRenderProps) => (
            <PageTableHeaderContent renderProps={getRenderProps}>{"SKU"}</PageTableHeaderContent>
        ),
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps}>{getPart().sku}</PageTableCellContent>
        ),
    },
    {
        id: "name",
        header: "Name",
        minWidthPx: 140,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.name.localeCompare(b.name),
        renderHeader: (getRenderProps) => (
            <PageTableHeaderContent renderProps={getRenderProps}>{"Name"}</PageTableHeaderContent>
        ),
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps}>{getPart().name}</PageTableCellContent>
        ),
    },
    {
        id: "category",
        header: "Category",
        widthPx: 120,
        minWidthPx: 90,
        maxWidthPx: 240,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.category.localeCompare(b.category),
        renderHeader: (getRenderProps) => (
            <PageTableHeaderContent renderProps={getRenderProps}>{"Category"}</PageTableHeaderContent>
        ),
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps}>{getPart().category}</PageTableCellContent>
        ),
    },
    {
        id: "stock",
        header: "In stock",
        widthPx: 100,
        minWidthPx: 70,
        maxWidthPx: 200,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.stock - b.stock,
        renderHeader: (getRenderProps) => (
            <PageTableHeaderContent renderProps={getRenderProps} align={"end"}>
                {"In stock"}
            </PageTableHeaderContent>
        ),
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps} align={"end"}>
                {getPart().stock.toLocaleString("en-GB")}
            </PageTableCellContent>
        ),
    },
    {
        id: "price",
        header: "Price",
        widthPx: 110,
        minWidthPx: 80,
        maxWidthPx: 220,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.pricePence - b.pricePence,
        renderHeader: (getRenderProps) => (
            <PageTableHeaderContent renderProps={getRenderProps} align={"end"}>
                {"Price"}
            </PageTableHeaderContent>
        ),
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps} align={"end"}>
                {formatPrice(getPart().pricePence)}
            </PageTableCellContent>
        ),
    },
];
