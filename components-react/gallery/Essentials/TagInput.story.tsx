import { useState } from "react";

import type { InteractionFlags, TagInputFlags } from "@thewaver/ss-components";

import { TagInput } from "../../src";

const FIELD_PADDING = 8;
const FIELD_GAP = 6;
const FIELD_MIN_HEIGHT = 32;
const FIELD_WIDTH = 360;
const NARROW_WIDTH = 240;

const TEXT_STYLE = { color: "black", caretColor: "red" };

const STARTING_TAGS = ["solid", "vanilla-extract"];
const CROWDED_TAGS = [
    "solid",
    "vanilla-extract",
    "playwright",
    "typescript",
    "vite",
    "eslint",
    "prettier",
    "vitest",
    "aria",
    "tokens",
    "signals",
    "stores",
];

const Box = ({ flags }: { flags: InteractionFlags<TagInputFlags> }) => (
    <div
        style={{
            position: "absolute",
            inset: 0,
            background: "white",
            border: `1px solid ${flags.hasError ? "red" : "black"}`,
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

const renderBox = (flags: InteractionFlags<TagInputFlags>) => <Box flags={flags} />;

const renderTag = (tag: string) => <span>{`${tag} ✕`}</span>;

const Readout = ({ tags }: { tags: string[] }) => (
    <output data-readout="tags">{`tags: ${tags.join(", ") || "none"}`}</output>
);

const Field = (props: {
    initial: string[];
    ariaLabel: string;
    width?: number;
    isDisabled?: boolean;
    computeTag?: (tags: string[]) => (text: string) => string | undefined;
}) => {
    const valueState = useState(props.initial);

    return (
        <div style={{ width: props.width ?? FIELD_WIDTH }}>
            <TagInput
                id="field"
                valueState={valueState}
                ariaLabel={props.ariaLabel}
                gap={FIELD_GAP}
                padding={FIELD_PADDING}
                minHeight={FIELD_MIN_HEIGHT}
                isDisabled={props.isDisabled}
                computeTextStyle={() => TEXT_STYLE}
                computeTag={props.computeTag?.(valueState[0])}
                renderContent={renderBox}
                renderPlaceholder={() => <span>Type and press Enter</span>}
                renderTag={renderTag}
            />
            <Readout tags={valueState[0]} />
        </div>
    );
};

export const Default = ({ isDisabled = false }: { isDisabled?: boolean }) => (
    <Field initial={STARTING_TAGS} ariaLabel="Topics" isDisabled={isDisabled} />
);

export const Empty = () => <Field initial={[]} ariaLabel="Empty topics" />;

export const Unique = () => (
    <Field
        initial={STARTING_TAGS}
        ariaLabel="Unique topics"
        computeTag={(tags) => (text) => {
            const tag = text.trim().toLowerCase();

            return tag && !tags.includes(tag) ? tag : undefined;
        }}
    />
);

export const Crowded = () => <Field initial={CROWDED_TAGS} ariaLabel="Crowded topics" width={NARROW_WIDTH} />;

export const RightToLeft = () => (
    <div dir="rtl">
        <Field initial={STARTING_TAGS} ariaLabel="Topics" />
    </div>
);
