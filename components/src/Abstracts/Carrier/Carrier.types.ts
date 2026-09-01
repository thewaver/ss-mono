export type CarryDir = "row" | "column";

export type CarryMode = "drag" | "tap" | "key";

export type CarryEndReason = "drop" | "cancel";

export type Carry = {
    groupId: string;
    key: string;
    label: string;
    value: unknown;
};

export type CarryOrigin = {
    label: string;
    index: number;
};

export type CarrierZone = {
    getGroupId: () => string;
    getLabel: () => string;
    getRootRef: () => HTMLElement | undefined;
    getItemRects: () => DOMRect[];
    getDir: () => CarryDir;
    getIsDisabled: () => boolean;
    getLength: () => number;
    computeCanAccept: (carry: Carry) => boolean;
    takeAt: (index: number) => void;
    putAt: (index: number, carry: Carry, origin: CarryOrigin) => void;
    moveAt: (fromIndex: number, toIndex: number) => void;
};
