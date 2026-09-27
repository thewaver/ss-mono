import { useEffect, useState, useSyncExternalStore } from "react";

import type {
    InteractionFlags,
    SortableAnnouncements,
    SortableGridAnnouncements,
    SortableGridFootprint,
    SortableGridGeometry,
    SortableGridItemFlags,
    SortableGridSpot,
} from "@thewaver/ss-components";

import {
    Sortable,
    SortableGrid,
    type SortableGridController,
    type SortableGridItem,
    type SortableGridProps,
    type SortableItem,
} from "../../src";

type Gear = { id: string; name: string };

const CELL_SIZE = 44;
const GRID_GAP = 4;
const PACK_COLUMNS = 8;
const PACK_ROWS = 5;
const STASH_COLUMNS = 4;
const STASH_ROWS = 5;
const TURNS_COLUMNS = 3;
const TURNS_ROWS = 3;
const TURN_KEY = "r";
const NO_SUBSCRIPTION = () => () => {};
const RESTING_FLAGS: InteractionFlags<SortableGridItemFlags> = { isCarried: false };

const CARRIER_ANNOUNCEMENTS = {
    computePickedUp: (itemLabel: string, zoneLabel: string) => `${itemLabel} picked up from ${zoneLabel}.`,
    computePickedUpByKey: (itemLabel: string, zoneLabel: string, placeLabel: string, keyHint: string) =>
        `${itemLabel} picked up from ${zoneLabel}, ${placeLabel}. ${keyHint}`,
    computeAimed: (placeLabel: string, zoneLabel: string) => `${placeLabel} in ${zoneLabel}.`,
    computeZoneEntered: (zoneLabel: string, placeLabel: string) => `${zoneLabel}, ${placeLabel}.`,
    computeReturned: (itemLabel: string, zoneLabel: string) => `${itemLabel} returned to ${zoneLabel}.`,
    computeLeftInPlace: (itemLabel: string) => `${itemLabel} left where it was.`,
    computeRefused: (itemLabel: string, toZoneLabel: string, fromZoneLabel: string) =>
        `${itemLabel} does not fit in ${toZoneLabel}, returned to ${fromZoneLabel}.`,
    computeDropped: (itemLabel: string, zoneLabel: string, placeLabel: string) =>
        `${itemLabel} dropped in ${zoneLabel}, ${placeLabel}.`,
};

const ANNOUNCEMENTS: SortableGridAnnouncements = {
    ...CARRIER_ANNOUNCEMENTS,
    restingKeyHint: "Press Enter to pick this up and move it.",
    keyHint: "Arrow keys move it, Enter drops, Escape cancels.",
    keyHintAcrossZones: "Arrow keys move it, Tab changes grid, Enter drops, Escape cancels.",
    computePlaceLabel: (spot, hasRoom) => `column ${spot.col + 1}, row ${spot.row + 1}${hasRoom ? "" : ", no room"}`,
};

const LIST_ANNOUNCEMENTS: SortableAnnouncements = {
    ...CARRIER_ANNOUNCEMENTS,
    restingKeyHint: "Press Enter to pick this up and move it.",
    keyHint: "Arrow keys choose a place, Enter drops, Escape cancels.",
    keyHintAcrossZones: "Arrow keys choose a place, Tab changes list, Enter drops, Escape cancels.",
    computePlaceLabel: (index, count) => `place ${index + 1} of ${count}`,
};

const ELL: SortableGridFootprint = [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
];

const ZED: SortableGridFootprint = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
];

const gear = (id: string, name: string, col: number, row: number, footprint: SortableGridFootprint) =>
    ({ value: { id, name }, spot: { row, col }, footprint }) satisfies SortableGridItem<Gear>;

const box = (colCount: number, rowCount: number) => ({ colCount, rowCount });

const PACK: SortableGridItem<Gear>[] = [
    gear("sword", "Longsword", 0, 0, box(1, 3)),
    gear("shield", "Kite Shield", 1, 0, box(2, 2)),
    gear("bow", "Hunting Bow", 3, 0, box(1, 4)),
    gear("potion", "Potion", 1, 2, box(1, 1)),
    gear("bread", "Bread", 2, 2, box(1, 1)),
    gear("scroll", "Scroll", 4, 0, box(2, 1)),
    gear("pickaxe", "Pickaxe", 6, 1, ELL),
    gear("chain", "Chain", 0, 3, ZED),
];

const STASH: SortableGridItem<Gear>[] = [
    gear("gem", "Gem", 0, 0, box(1, 1)),
    gear("tome", "Tome", 1, 0, box(2, 2)),
    gear("rope", "Rope", 0, 1, box(1, 2)),
];

const TURNS: SortableGridItem<Gear>[] = [gear("hook", "Hook", 0, 0, ELL), gear("flint", "Flint", 1, 0, box(1, 1))];

const LOOT: SortableItem<Gear>[] = [
    { value: { id: "pouch", name: "Coin Pouch" } },
    { value: { id: "key", name: "Iron Key" } },
    { value: { id: "herb", name: "Herb" } },
];

const WALLS: SortableGridSpot[] = [
    { row: 1, col: 2 },
    { row: 1, col: 3 },
    { row: 2, col: 7 },
];

const computeIsWall = (spot: SortableGridSpot) => WALLS.some((wall) => wall.row === spot.row && wall.col === spot.col);

const SCATTERED: SortableGridItem<Gear>[] = [
    gear("sword", "Longsword", 0, 2, box(1, 3)),
    gear("shield", "Kite Shield", 2, 3, box(2, 2)),
    gear("scroll", "Scroll", 4, 2, box(2, 1)),
    gear("pickaxe", "Pickaxe", 6, 2, ELL),
    gear("bread", "Bread", 1, 4, box(1, 1)),
    gear("potion", "Potion", 5, 4, box(1, 1)),
];

const outlineBox = (geometry: SortableGridGeometry) => ({
    width: Math.max(...geometry.outline.map((point) => point.x)),
    height: Math.max(...geometry.outline.map((point) => point.y)),
});

const points = (geometry: SortableGridGeometry) => geometry.outline.map((point) => `${point.x},${point.y}`).join(" ");

const GearBody = ({
    item,
    flags,
    geometry,
}: {
    item: SortableGridItem<Gear>;
    flags: InteractionFlags<SortableGridItemFlags>;
    geometry: SortableGridGeometry;
}) => {
    const size = outlineBox(geometry);

    return (
        <div style={{ position: "relative", flex: "1 1 auto", opacity: flags.isCarried ? 0.4 : 1 }}>
            <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
                viewBox={`0 0 ${size.width} ${size.height}`}
                aria-hidden="true"
            >
                <polygon points={points(geometry)} fill="#fff" stroke="#666" strokeWidth={2} />
            </svg>
            <div
                style={{
                    position: "absolute",
                    left: geometry.block.left,
                    top: geometry.block.top,
                    width: geometry.block.width,
                    height: geometry.block.height,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 10,
                }}
                aria-hidden="true"
            >
                {item.value.name}
            </div>
        </div>
    );
};

const Landing = ({ isAllowed, geometry }: { isAllowed: boolean; geometry: SortableGridGeometry }) => {
    const size = outlineBox(geometry);

    return (
        <svg
            data-landing={isAllowed ? "allowed" : "refused"}
            style={{ width: "100%", height: "100%", overflow: "visible" }}
            viewBox={`0 0 ${size.width} ${size.height}`}
            aria-hidden="true"
        >
            <polygon points={points(geometry)} fill="none" stroke={isAllowed ? "#36c" : "#c00"} strokeDasharray="4 3" />
        </svg>
    );
};

type InventoryProps = Partial<SortableGridProps<Gear>> & {
    groupId: string;
    ariaLabel: string;
    itemsState: SortableGridProps<Gear>["itemsState"];
    hasTurnButtons?: boolean;
    hasTidyButton?: boolean;
    isCompacting?: boolean;
};

const Inventory = ({ hasTurnButtons, hasTidyButton, isCompacting, ...rest }: InventoryProps) => {
    const [controller, setController] = useState<SortableGridController>();

    const isCarrying = useSyncExternalStore(
        controller?.subscribe ?? NO_SUBSCRIPTION,
        () => controller?.getIsCarrying() ?? false,
    );

    const turn = (step: number) => {
        if (step > 0) controller?.turnCw();
        else controller?.turnCcw();
    };

    useEffect(() => {
        if (!(rest.isTurnable ?? false)) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!controller?.getIsCarrying() || e.key.toLowerCase() !== TURN_KEY) return;

            e.preventDefault();

            if (e.shiftKey) controller.turnCcw();
            else controller.turnCw();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [controller, rest.isTurnable]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {hasTurnButtons && (
                <div>
                    <button data-turn="ccw" disabled={!isCarrying} onClick={() => turn(-1)}>
                        {"↺"}
                    </button>
                    <button data-turn="cw" disabled={!isCarrying} onClick={() => turn(1)}>
                        {"↻"}
                    </button>
                </div>
            )}

            {hasTidyButton && (
                <div>
                    <button onClick={() => controller?.compact()}>Tidy up</button>
                </div>
            )}

            <SortableGrid<Gear>
                announcements={ANNOUNCEMENTS}
                columns={PACK_COLUMNS}
                rows={PACK_ROWS}
                cellSize={CELL_SIZE}
                gap={GRID_GAP}
                computeItemKey={(value) => value.id}
                computeItemLabel={(value) => value.name}
                renderItem={(item, flags, geometry) => <GearBody item={item} flags={flags} geometry={geometry} />}
                renderCarried={(item, geometry) => <GearBody item={item} flags={RESTING_FLAGS} geometry={geometry} />}
                renderCell={(spot, flags) => (
                    <div
                        data-blocked={flags.isBlocked || undefined}
                        style={{
                            flex: "1 1 auto",
                            background: flags.isBlocked ? "#999" : (spot.col + spot.row) % 2 ? "#eee" : "#f6f6f6",
                        }}
                    />
                )}
                renderLanding={(isAllowed, geometry) => <Landing isAllowed={isAllowed} geometry={geometry} />}
                onTransfer={() => {
                    if (isCompacting) controller?.compact();
                }}
                onMount={(mounted) => {
                    setController(mounted);

                    if (isCompacting) mounted.compact();
                }}
                {...rest}
            />
        </div>
    );
};

const spots = (items: SortableGridItem<Gear>[]) =>
    items.map((item) => `${item.value.name} at ${item.spot.col + 1},${item.spot.row + 1}`).join(" | ") || "empty";

const Single = ({
    scope,
    initial,
    ...rest
}: { scope: string; initial: SortableGridItem<Gear>[] } & Omit<InventoryProps, "groupId" | "itemsState">) => {
    const itemsState = useState(initial);

    return (
        <div data-testid={scope} style={{ padding: 10 }}>
            <Inventory groupId={scope} itemsState={itemsState} {...rest} />
            <output data-readout="grid">{spots(itemsState[0])}</output>
        </div>
    );
};

export const Default = () => (
    <>
        <Single scope="pack" initial={PACK} ariaLabel="Pack" isTurnable={true} hasTurnButtons={true} />
        <Single
            scope="turns"
            initial={TURNS}
            ariaLabel="Bench"
            columns={TURNS_COLUMNS}
            rows={TURNS_ROWS}
            isTurnable={true}
        />
        <Single scope="disabled" initial={PACK} ariaLabel="Disabled pack" isDisabled={true} />
    </>
);

export const Walls = () => (
    <>
        <Single
            scope="walls"
            initial={SCATTERED}
            ariaLabel="Walled pack"
            isTurnable={true}
            hasTidyButton={true}
            computeIsSpotBlocked={computeIsWall}
        />
        <Single scope="dashboard" initial={PACK} ariaLabel="Packed pack" isTurnable={true} isCompacting={true} />
    </>
);

const Pair = ({ scope, isSideLocked = false }: { scope: string; isSideLocked?: boolean }) => {
    const packState = useState(PACK);
    const stashState = useState(STASH);

    return (
        <div data-testid={scope} style={{ display: "flex", gap: 20, padding: 10 }}>
            <Inventory groupId={scope} ariaLabel="Pack" itemsState={packState} isTurnable={true} />
            <Inventory
                groupId={scope}
                ariaLabel="Stash"
                itemsState={stashState}
                columns={STASH_COLUMNS}
                rows={STASH_ROWS}
                isTurnable={true}
                isLocked={isSideLocked}
            />
        </div>
    );
};

export const Pairs = () => (
    <>
        <Pair scope="pair" />
        <Pair scope="locked" isSideLocked={true} />
    </>
);

export const Loot = () => {
    const lootState = useState(LOOT);
    const packState = useState(PACK);

    return (
        <div data-testid="loot" style={{ display: "flex", gap: 20, padding: 10 }}>
            <div style={{ width: 200 }}>
                <Sortable<Gear>
                    groupId="loot"
                    ariaLabel="Ground"
                    announcements={LIST_ANNOUNCEMENTS}
                    gap={GRID_GAP}
                    minHeight={72}
                    itemsState={lootState}
                    computeItemKey={(value) => value.id}
                    computeItemLabel={(value) => value.name}
                    renderItem={(item) => <div style={{ padding: 8, border: "1px solid #999" }}>{item.value.name}</div>}
                />
            </div>
            <Inventory groupId="loot" ariaLabel="Pack" itemsState={packState} isTurnable={true} />
            <output data-readout="ground">{lootState[0].map((item) => item.value.name).join(", ") || "empty"}</output>
        </div>
    );
};
