import { useMemo, useState } from "react";

import type { TableAnnouncements, TableColumnRenderProps, TableSort } from "@thewaver/ss-components";

import { Table, TableHeaderReorder, TableHeaderSort } from "../../src";
import type { TableColumn } from "../../src";

type Part = { sku: string; name: string; category: string; stock: number; pricePence: number };

const STRESS_PART_COUNT = 50000;
const ESTIMATED_ROW_HEIGHT = 29;
const SHORT_FRAME_HEIGHT = 260;
const TALL_FRAME_HEIGHT = 420;
const CATEGORIES = ["Fastener", "Bearing", "Gasket", "Housing", "Spring", "Bracket"];

const PARTS: Part[] = [
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

const ANNOUNCEMENTS: TableAnnouncements = {
    computePickedUp: (itemLabel) => `${itemLabel} picked up.`,
    computePickedUpByKey: (itemLabel, _zoneLabel, placeLabel, keyHint) =>
        `${itemLabel} picked up at ${placeLabel}. ${keyHint}`,
    computeAimed: (placeLabel) => `Over ${placeLabel}.`,
    computeZoneEntered: (zoneLabel, placeLabel) => `In ${zoneLabel}, ${placeLabel}.`,
    computeReturned: (itemLabel) => `${itemLabel} put back.`,
    computeLeftInPlace: (itemLabel) => `${itemLabel} left in place.`,
    computeRefused: (itemLabel) => `${itemLabel} cannot go there.`,
    computeDropped: (itemLabel, _zoneLabel, placeLabel) => `${itemLabel} dropped at ${placeLabel}.`,
    restingKeyHint: "Press Enter to pick this column up and move it.",
    keyHint: "Enter drops, Escape cancels.",
    computePlaceLabel: (index, count) => `column ${index + 1} of ${count}`,
    computeColumnMoved: (header, index, count) => `${header} moved to column ${index + 1} of ${count}.`,
};

const createStressParts = (): Part[] =>
    Array.from({ length: STRESS_PART_COUNT }, (_, index) => ({
        sku: `PT-${String(index).padStart(6, "0")}`,
        name: `Part ${index}`,
        category: CATEGORIES[index % CATEGORIES.length],
        stock: (index * 37) % 2000,
        pricePence: ((index * 197) % 25000) + 10,
    }));

const Header = ({ text }: { text: string }) => (
    <div style={{ display: "flex", gap: 4 }}>
        <TableHeaderReorder renderContent={() => <span>⠿</span>} />
        <span style={{ flex: 1 }}>{text}</span>
        <TableHeaderSort
            renderContent={(renderProps: TableColumnRenderProps) => (
                <span>{renderProps.sortDirection === "descending" ? "▼" : "▲"}</span>
            )}
        />
    </div>
);

const column = (
    id: keyof Part & string,
    header: string,
    opts: Partial<TableColumn<Part>>,
    format: (part: Part) => string = (part) => String(part[id]),
): TableColumn<Part> => ({
    id,
    header,
    isSortable: true,
    renderHeader: () => <Header text={header} />,
    renderCell: (part) => <span>{format(part)}</span>,
    ...opts,
});

const createColumns = (defs: { isResizable?: boolean; isReorderable?: boolean }): TableColumn<Part>[] => {
    const shared = { isResizable: defs.isResizable, isReorderable: defs.isReorderable };

    return [
        column("sku", "SKU", {
            ...shared,
            widthPx: 110,
            minWidthPx: 80,
            maxWidthPx: 260,
            compare: (a, b) => a.sku.localeCompare(b.sku),
        }),
        column("name", "Name", { ...shared, minWidthPx: 140, compare: (a, b) => a.name.localeCompare(b.name) }),
        column("category", "Category", {
            ...shared,
            widthPx: 120,
            compare: (a, b) => a.category.localeCompare(b.category),
        }),
        column("stock", "In stock", { ...shared, widthPx: 100, compare: (a, b) => a.stock - b.stock }, (part) =>
            part.stock.toLocaleString("en-GB"),
        ),
        column(
            "pricePence",
            "Price",
            { ...shared, widthPx: 110, compare: (a, b) => a.pricePence - b.pricePence },
            (part) => `£${(part.pricePence / 100).toFixed(2)}`,
        ),
    ];
};

const CONSUMER_COLUMNS: TableColumn<Part>[] = [
    column("sku", "SKU", { widthPx: 110 }),
    column("name", "Name", { minWidthPx: 140 }),
    column("category", "Category", { widthPx: 140, isSortable: false }),
];

const Readout = ({ sort, selection, extra }: { sort: TableSort | undefined; selection: Part[]; extra?: string }) => {
    const sortText = sort ? `${sort.columnId} ${sort.direction}` : "unsorted";
    const selectedText = selection.map((part) => part.sku).join(", ");

    return <output data-readout="table">{`sort: ${sortText}; selected: ${selectedText}${extra ?? ""}`}</output>;
};

type Preset = "default" | "singleSelection" | "resizable" | "reorderable" | "virtualized" | "disabled";

export const Default = ({ preset = "default" }: { preset?: Preset }) => {
    const sortState = useState<TableSort | undefined>();
    const selectionState = useState<Part[]>([]);
    const widthsState = useState<Record<string, number>>({});
    const orderState = useState<string[]>([]);
    const stressParts = useMemo(() => (preset === "virtualized" ? createStressParts() : []), [preset]);

    const columns = useMemo(
        () => createColumns({ isResizable: preset === "resizable", isReorderable: preset === "reorderable" }),
        [preset],
    );

    const isVirtualized = preset === "virtualized";

    return (
        <>
            <div
                data-frame
                style={{
                    width: 700,
                    overflow: "auto",
                    height: isVirtualized ? TALL_FRAME_HEIGHT : undefined,
                    maxHeight: isVirtualized ? undefined : SHORT_FRAME_HEIGHT,
                }}
            >
                {preset === "reorderable" ? (
                    <Table
                        columns={columns}
                        rows={PARTS}
                        sortState={sortState}
                        selectionState={selectionState}
                        orderState={orderState}
                        announcements={ANNOUNCEMENTS}
                        ariaLabel="Parts with reorderable columns"
                        renderMarker={() => <div data-marker style={{ width: 2, height: "100%" }} />}
                    />
                ) : (
                    <Table
                        columns={columns}
                        rows={isVirtualized ? stressParts : PARTS}
                        sortState={sortState}
                        selectionState={selectionState}
                        widthsState={preset === "resizable" ? widthsState : undefined}
                        selectionMode={preset === "singleSelection" ? "single" : undefined}
                        isDisabled={preset === "disabled"}
                        computeEstimatedRowHeight={isVirtualized ? () => ESTIMATED_ROW_HEIGHT : undefined}
                        ariaLabel={isVirtualized ? "Every part" : "Parts"}
                    />
                )}
            </div>
            <Readout
                sort={sortState[0]}
                selection={selectionState[0]}
                extra={`; widths: ${JSON.stringify(widthsState[0])}; order: ${orderState[0].join(",")}`}
            />
        </>
    );
};

export const ConsumerSorted = () => {
    const [rows, setRows] = useState(PARTS);
    const sortState = useState<TableSort | undefined>();

    return (
        <>
            <div data-frame style={{ width: 700, overflow: "auto", maxHeight: SHORT_FRAME_HEIGHT }}>
                <Table
                    columns={CONSUMER_COLUMNS}
                    rows={rows}
                    sortState={sortState}
                    ariaLabel="Parts sorted by the page"
                    onSortChange={(sort) => {
                        if (!sort) {
                            setRows(PARTS);

                            return;
                        }

                        const key = sort.columnId as "sku" | "name";
                        const sign = sort.direction === "ascending" ? 1 : -1;

                        setRows([...PARTS].sort((a, b) => sign * a[key].localeCompare(b[key])));
                    }}
                />
            </div>
            <Readout sort={sortState[0]} selection={[]} />
        </>
    );
};

export const Orphan = () => <TableHeaderSort renderContent={() => <span>sort</span>} />;
