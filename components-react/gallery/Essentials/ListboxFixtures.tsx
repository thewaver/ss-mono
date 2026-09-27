import type { PropsWithChildren, ReactNode } from "react";

import type { InteractionFlags, SelectGroupFlags, SelectOptionFlags } from "@thewaver/ss-components";

import type { SelectItem, SelectOption, SelectOptionTooltipDefs } from "../../src";

const SURFACE_WIDTH = 240;
const SURFACE_HEIGHT = 220;
const OPTION_PADDING = 6;

const explain = (text: string): SelectOptionTooltipDefs => ({
    placement: { x: "right-out", y: "center" },
    offset: { x: 10, y: 0 },
    hoverShowDelayMs: 0,
    renderContent: (visibilityTarget) => <div style={{ opacity: visibilityTarget, background: "white" }}>{text}</div>,
});

export const COUNTRIES: SelectOption<string>[] = [
    { value: "Belgium" },
    { value: "Denmark" },
    { value: "Estonia" },
    { value: "Finland" },
    { value: "Portugal" },
    { value: "Sweden" },
];

export const COUNTRIES_WITH_DISABLED: SelectOption<string>[] = [
    { value: "Belgium" },
    { value: "Denmark", isDisabled: true },
    { value: "Estonia" },
    { value: "Finland", isDisabled: true },
    { value: "Portugal" },
    { value: "Sweden" },
];

export const COUNTRIES_WITH_REACHABLE: SelectOption<string>[] = [
    { value: "Belgium" },
    {
        value: "Denmark",
        isDisabled: true,
        isReachableWhenDisabled: true,
        tooltipDefs: explain("Not shipping here until the new depot opens."),
    },
    { value: "Estonia" },
    {
        value: "Finland",
        isDisabled: true,
        isReachableWhenDisabled: true,
        tooltipDefs: explain("Out of stock for the rest of the quarter."),
    },
    { value: "Portugal" },
    { value: "Sweden" },
];

export const GROUPED_COUNTRIES: SelectItem<string>[] = [
    {
        label: "Nordics",
        options: [{ value: "Denmark" }, { value: "Finland", isDisabled: true }, { value: "Sweden" }],
    },
    {
        label: "Benelux",
        options: [{ value: "Belgium" }, { value: "Netherlands" }],
    },
    { value: "Portugal" },
];

export const SIZES: SelectOption<string>[] = [
    { value: "XS" },
    { value: "S" },
    { value: "M" },
    { value: "L", isDisabled: true },
    { value: "XL" },
];

export const Surface = (props: PropsWithChildren<{ isWide?: boolean }>) => (
    <div
        data-testid="surface"
        style={{
            boxSizing: "border-box",
            width: props.isWide ? "auto" : SURFACE_WIDTH,
            maxHeight: SURFACE_HEIGHT,
            overflowY: "auto",
            padding: 5,
            border: "1px solid gray",
        }}
    >
        {props.children}
    </div>
);

export const OptionContent = (props: {
    flags: InteractionFlags<SelectOptionFlags>;
    description?: string;
    children: ReactNode;
}) => (
    <div
        data-highlighted={String(props.flags.isHighlighted)}
        style={{
            display: "flex",
            justifyContent: "space-between",
            padding: OPTION_PADDING,
            background: props.flags.isHighlighted ? "lavender" : "transparent",
            opacity: props.flags.isDisabled ? 0.5 : 1,
        }}
    >
        <div>
            <div>{props.children}</div>
            {props.description && <div>{props.description}</div>}
        </div>
        <div aria-hidden="true">{props.flags.isSelected ? "✓" : ""}</div>
    </div>
);

export const GroupContent = (props: { flags: SelectGroupFlags; children: ReactNode }) => (
    <div data-checked-state={String(props.flags.checkedState)} aria-hidden="true" style={{ fontWeight: "bold" }}>
        {props.children}
    </div>
);

export type Airport = { code: string; city: string };

export type Delivery = { name: string; description: string };

const HOUR_COUNT = 24;

const DESCRIPTIONS = [
    "Next working day, before 13:00.",
    "Three to five working days, left with the local post office if nobody answers.",
    "Held at the depot for up to fourteen days. Bring the order number and photo ID, or name someone else at checkout and they can collect it on your behalf instead.",
];

export const PLACEHOLDER = "Pick one";

export const HOURS: SelectOption<string>[] = Array.from({ length: HOUR_COUNT }, (_unused, hour) => ({
    value: `${String(hour).padStart(2, "0")}:00`,
}));

export const AIRPORTS: SelectOption<Airport>[] = [
    { value: { code: "AMS", city: "Amsterdam" } },
    { value: { code: "CPH", city: "Copenhagen" } },
    { value: { code: "LIS", city: "Lisbon" } },
    { value: { code: "OSL", city: "Oslo" } },
    { value: { code: "TLL", city: "Tallinn" } },
];

export const createDeliveries = (count: number, offset = 0): SelectOption<Delivery>[] =>
    Array.from({ length: count }, (_unused, index) => ({
        value: {
            name: `Route ${offset + index + 1}`,
            description: DESCRIPTIONS[(offset + index) % DESCRIPTIONS.length],
        },
    }));

export const DELIVERY_GROUP_SIZE = 50;

export const createDeliveryGroups = (count: number): SelectItem<Delivery>[] =>
    Array.from({ length: Math.ceil(count / DELIVERY_GROUP_SIZE) }, (_unused, groupIndex) => {
        const offset = groupIndex * DELIVERY_GROUP_SIZE;

        return {
            label: `Depot ${groupIndex + 1}`,
            options: createDeliveries(Math.min(DELIVERY_GROUP_SIZE, count - offset), offset),
        };
    });

export const PopupSurface = (props: PropsWithChildren<{ visibilityTarget: 0 | 1; durationMs: number }>) => (
    <div
        data-testid="popup"
        style={{
            boxSizing: "border-box",
            maxHeight: SURFACE_HEIGHT,
            overflowY: "auto",
            padding: 4,
            border: "1px solid gray",
            background: "white",
            lineHeight: 1.15,
            opacity: props.visibilityTarget,
            transition: `opacity ${props.durationMs}ms`,
        }}
    >
        {props.children}
    </div>
);
