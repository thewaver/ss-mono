import { useRef, useState } from "react";

import { type CarrierAnnouncements, CarrierUtils, type Carry } from "@thewaver/ss-components";

import { CarrierReactUtils } from "../../src";

const ANNOUNCEMENTS: CarrierAnnouncements = {
    computePickedUp: (item) => `Picked up ${item}`,
    computePickedUpByKey: (item) => `Picked up ${item}`,
    computeAimed: (place) => `At ${place}`,
    computeZoneEntered: (zone) => `In ${zone}`,
    computeReturned: (item) => `Returned ${item}`,
    computeLeftInPlace: (item) => `Left ${item}`,
    computeRefused: (item) => `Refused ${item}`,
    computeDropped: (item, zone) => `Dropped ${item} in ${zone}`,
};

const useList = (id: string, initial: string[]) => {
    const [items, setItems] = useState(initial);
    const ref = useRef<HTMLDivElement>(null);

    const zone = CarrierReactUtils.useZone({
        getGroupId: () => "group",
        getLabel: () => id,
        getRootRef: () => ref.current ?? undefined,
        getIsDisabled: () => false,
        getKeyHint: () => "",
        getAnnouncements: () => ANNOUNCEMENTS,
        computeCanAccept: () => true,
        computePlaceAtPoint: () => items.length,
        computeNudgedPlace: (place) => place,
        computeEntryPlace: () => items.length,
        computeIsSamePlace: (a, b) => a === b,
        computeIsPlaceAllowed: () => true,
        computePlaceLabel: (place) => String(place),
        takeAt: (place) => setItems((current) => current.filter((_unused, index) => index !== place)),
        putAt: (place, carry) =>
            setItems((current) => [
                ...current.slice(0, place as number),
                carry.value as string,
                ...current.slice(place as number),
            ]),
        moveAt: () => {},
    });

    return { id, items, ref, zone };
};

export const Default = () => {
    const left = useList("left", ["one", "two"]);
    const right = useList("right", []);
    const carry = CarrierReactUtils.useCarry();
    const isAllowed = CarrierReactUtils.useIsTargetAllowed();

    const pickUp = () => {
        const item: Carry = { groupId: "group", key: "one", label: "one", value: "one" };

        CarrierUtils.start(left.zone, 0, item, "key");
    };

    return (
        <>
            {[left, right].map((list) => (
                <div key={list.id} ref={list.ref} data-testid={list.id}>
                    {list.items.join(",")}
                </div>
            ))}
            <button type="button" data-testid="pick" onClick={pickUp}>
                Pick
            </button>
            <button type="button" data-testid="next" onClick={() => CarrierUtils.aimAtNextZone(1)}>
                Next
            </button>
            <button type="button" data-testid="drop" onClick={() => CarrierUtils.end("drop")}>
                Drop
            </button>
            <output data-readout="carrying">{carry?.carry.label ?? "nothing"}</output>
            <output data-readout="target">{carry?.to.getLabel() ?? "none"}</output>
            <output data-readout="allowed">{String(isAllowed)}</output>
        </>
    );
};
