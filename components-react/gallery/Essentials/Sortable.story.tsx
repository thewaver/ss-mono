import { type ReactNode, useState } from "react";

import { PlacementLayoutUtils, type SortableAnnouncements, type SortableOrientation } from "@thewaver/ss-components";

import { Sortable, type SortableItem, type SortableProps } from "../../src";

type Card = { id: string; name: string; cost: number };

const LIST_GAP = 8;
const CHEAP_ONLY = 3;
const RING_WIDTH = 324;
const RING_LAYOUT = PlacementLayoutUtils.createArc({
    curveHeightRatio: 1,
    spreadDegrees: 360,
    facingDegrees: 45,
    itemWidthRatio: 0.6512,
    itemHeightRatio: 0.2938,
});

const ANNOUNCEMENTS: SortableAnnouncements = {
    computePickedUp: (itemLabel, zoneLabel) => `${itemLabel} picked up from ${zoneLabel}.`,
    computePickedUpByKey: (itemLabel, zoneLabel, placeLabel, keyHint) =>
        `${itemLabel} picked up from ${zoneLabel}, ${placeLabel}. ${keyHint}`,
    computeAimed: (placeLabel, zoneLabel) => `${placeLabel} in ${zoneLabel}.`,
    computeZoneEntered: (zoneLabel, placeLabel) => `${zoneLabel}, ${placeLabel}.`,
    computeReturned: (itemLabel, zoneLabel) => `${itemLabel} returned to ${zoneLabel}.`,
    computeLeftInPlace: (itemLabel) => `${itemLabel} left where it was.`,
    computeRefused: (itemLabel, toZoneLabel, fromZoneLabel) =>
        `${itemLabel} does not fit in ${toZoneLabel}, returned to ${fromZoneLabel}.`,
    computeDropped: (itemLabel, zoneLabel, placeLabel) => `${itemLabel} dropped in ${zoneLabel}, ${placeLabel}.`,
    restingKeyHint: "Press Enter to pick this up and move it.",
    keyHint: "Arrow keys choose a place, Enter drops, Escape cancels.",
    keyHintAcrossZones: "Arrow keys choose a place, Tab changes list, Enter drops, Escape cancels.",
    computePlaceLabel: (index, count) => `place ${index + 1} of ${count}`,
};

const card = (id: string, name: string, cost: number): SortableItem<Card> => ({ value: { id, name, cost } });

const HAND: SortableItem<Card>[] = [
    card("ember", "Ember Sprite", 2),
    card("gale", "Gale Warden", 3),
    card("tide", "Tide Caller", 5),
];

const BOARD: SortableItem<Card>[] = [card("root", "Root Golem", 4)];

const QUEUE: SortableItem<Card>[] = [
    card("one", "First", 1),
    { ...card("two", "Second — locked", 2), isDisabled: true },
    card("three", "Third", 3),
    card("four", "Fourth", 4),
];

const names = (items: SortableItem<Card>[]) => items.map((item) => item.value.name).join(", ") || "empty";

const CardBody = ({ item, isCentered = false }: { item: SortableItem<Card>; isCentered?: boolean }) => (
    <div
        style={{
            display: "flex",
            gap: 8,
            padding: 8,
            border: "1px solid #999",
            background: "#fff",
            whiteSpace: "nowrap",
            marginInline: isCentered ? "auto" : undefined,
        }}
    >
        <span>{item.value.name}</span>
        <span>{item.value.cost}</span>
    </div>
);

const Marker = ({ orientation }: { orientation: SortableOrientation }) => (
    <div
        style={{
            alignSelf: "stretch",
            background: "#36c",
            width: orientation === "horizontal" ? 3 : undefined,
            height: orientation === "horizontal" ? undefined : 3,
        }}
    />
);

const RingMarker = () => <div data-marker style={{ width: 4, height: "70%", background: "#36c" }} />;

type CardsProps = Partial<SortableProps<Card>> & {
    groupId: string;
    ariaLabel: string;
    itemsState: SortableProps<Card>["itemsState"];
};

const Cards = (props: CardsProps) => (
    <Sortable<Card>
        announcements={ANNOUNCEMENTS}
        gap={LIST_GAP}
        minHeight={72}
        computeItemKey={(value) => value.id}
        computeItemLabel={(value) => value.name}
        renderItem={(item) => <CardBody item={item} />}
        renderCarried={(item) => <CardBody item={item} />}
        renderMarker={(orientation) => <Marker orientation={orientation} />}
        {...props}
    />
);

const Room = ({ scope, children }: { scope: string; children: ReactNode }) => (
    <div data-testid={scope} style={{ padding: 10, width: 480 }}>
        {children}
    </div>
);

const Single = ({
    scope,
    initial,
    ...rest
}: { scope: string; initial: SortableItem<Card>[] } & Omit<CardsProps, "itemsState" | "groupId">) => {
    const itemsState = useState(initial);

    return (
        <Room scope={scope}>
            <Cards groupId={scope} itemsState={itemsState} {...rest} />
            <output data-readout="order">{`order: ${names(itemsState[0])}`}</output>
        </Room>
    );
};

const Pair = ({
    scope,
    initialBoard = BOARD,
    isBoardLocked = false,
    computeCanAccept,
}: {
    scope: string;
    initialBoard?: SortableItem<Card>[];
    isBoardLocked?: boolean;
    computeCanAccept?: (value: Card, fromLabel: string) => boolean;
}) => {
    const handState = useState(HAND);
    const boardState = useState(initialBoard);

    return (
        <div data-testid={scope} style={{ display: "flex", gap: 20, padding: 10 }}>
            <div style={{ width: 240 }}>
                <Cards groupId={scope} ariaLabel={"Hand"} itemsState={handState} />
            </div>
            <div style={{ width: 240 }}>
                <Cards
                    groupId={scope}
                    ariaLabel={"Board"}
                    itemsState={boardState}
                    isLocked={isBoardLocked}
                    computeCanAccept={computeCanAccept}
                />
            </div>
            <output data-readout="order">{`hand: ${names(handState[0])} | board: ${names(boardState[0])}`}</output>
        </div>
    );
};

export const Default = () => (
    <>
        <Single scope="reorder" initial={QUEUE} ariaLabel={"Queue"} />
        <Single scope="row" initial={HAND} ariaLabel={"Row"} orientation={"horizontal"} />
        <Single scope="disabled" initial={HAND} ariaLabel={"Disabled list"} isDisabled={true} />
    </>
);

export const Pairs = () => (
    <>
        <Pair scope="pair" />
        <Pair scope="picky" initialBoard={[]} computeCanAccept={(value) => value.cost <= CHEAP_ONLY} />
        <Pair scope="locked" isBoardLocked={true} />
    </>
);

export const Ring = () => (
    <Room scope="ring">
        <div style={{ width: RING_WIDTH }}>
            <RingList />
        </div>
    </Room>
);

const RingList = () => {
    const itemsState = useState(QUEUE);

    return (
        <>
            <Cards
                groupId={"ring"}
                ariaLabel={"Ring"}
                itemsState={itemsState}
                minHeight={undefined}
                computeLayout={RING_LAYOUT}
                renderItem={(item) => <CardBody item={item} isCentered={true} />}
                renderMarker={() => <RingMarker />}
            />
            <output data-readout="order">{`order: ${names(itemsState[0])}`}</output>
        </>
    );
};

export const RightToLeft = () => (
    <div dir="rtl">
        <Single scope="rightToLeft" initial={HAND} ariaLabel={"Row"} orientation={"horizontal"} />
    </div>
);
