import type { SelectItemRecord, SelectOptionRecord } from "@thewaver/ss-components";

import type { Airport, Delivery } from "./SelectRecords.types";

import { FIELD_CHEVRON_WIDTH, FIELD_GAP, FIELD_PADDING } from "../../StyledComponents/SelectContent/SelectContent.css";

const HOUR_COUNT = 24;

export const PLACEHOLDER = "Pick one";

export const QUERY_PADDING = {
    paddingTop: FIELD_PADDING,
    paddingBottom: FIELD_PADDING,
    paddingLeft: FIELD_PADDING,
    paddingRight: FIELD_PADDING + FIELD_GAP + FIELD_CHEVRON_WIDTH,
};

export const COUNTRIES: SelectOptionRecord<string, never>[] = [
    { value: "Belgium" },
    { value: "Denmark" },
    { value: "Estonia" },
    { value: "Finland" },
    { value: "Portugal" },
    { value: "Sweden" },
];

export const COUNTRIES_WITH_DISABLED: SelectOptionRecord<string, never>[] = [
    { value: "Belgium" },
    { value: "Denmark", isDisabled: true },
    { value: "Estonia" },
    { value: "Finland", isDisabled: true },
    { value: "Portugal" },
    { value: "Sweden" },
];

export const GROUPED_COUNTRIES: SelectItemRecord<string, never>[] = [
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

export const HOURS: SelectOptionRecord<string, never>[] = Array.from({ length: HOUR_COUNT }, (_unused, hour) => ({
    value: `${String(hour).padStart(2, "0")}:00`,
}));

export const AIRPORTS: SelectOptionRecord<Airport, never>[] = [
    { value: { code: "AMS", city: "Amsterdam" } },
    { value: { code: "CPH", city: "Copenhagen" } },
    { value: { code: "LIS", city: "Lisbon" } },
    { value: { code: "OSL", city: "Oslo" } },
    { value: { code: "TLL", city: "Tallinn" } },
];

export const DELIVERIES: SelectOptionRecord<Delivery, never>[] = [
    {
        value: {
            name: "Standard",
            description: "Three to five working days, left with the local post office if nobody answers.",
        },
    },
    {
        value: { name: "Express", description: "Next working day, before 13:00." },
    },
    {
        value: {
            name: "Depot pickup",
            description:
                "Held at the depot you choose for up to fourteen days. Bring the order number and photo ID, or name someone else at checkout and they can collect it for you instead.",
        },
    },
    {
        value: {
            name: "Courier to the door",
            description: "A two-hour window you pick the evening before, with a call ten minutes ahead.",
        },
    },
];

export const STRESS_DESCRIPTIONS = [
    "Next working day, before 13:00.",
    "Three to five working days, left with the local post office if nobody answers.",
    "Held at the depot for up to fourteen days. Bring the order number and photo ID, or name someone else at checkout and they can collect it on your behalf instead.",
];

export const createStressDeliveries = (count: number, offset = 0): SelectOptionRecord<Delivery, never>[] =>
    Array.from({ length: count }, (_unused, index) => ({
        value: {
            name: `Route ${offset + index + 1}`,
            description: STRESS_DESCRIPTIONS[(offset + index) % STRESS_DESCRIPTIONS.length],
        },
    }));

export const STRESS_GROUP_SIZE = 50;

export const createStressDeliveryGroups = (count: number): SelectItemRecord<Delivery, never>[] =>
    Array.from({ length: Math.ceil(count / STRESS_GROUP_SIZE) }, (_unused, groupIndex) => {
        const offset = groupIndex * STRESS_GROUP_SIZE;

        return {
            label: `Depot ${groupIndex + 1}`,
            options: createStressDeliveries(Math.min(STRESS_GROUP_SIZE, count - offset), offset),
        };
    });
