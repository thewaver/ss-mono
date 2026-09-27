import { useState } from "react";

import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

import { TextArea } from "../../src";

const FIELD_WIDTH = 300;
const FIXED_HEIGHT = 110;
const FIELD_PADDING = 8;
const MIN_ROWS = 2;
const MAX_ROWS = 8;

const TEXT_STYLE = { fontSize: "16px", lineHeight: "20px" };

const Frame = ({ flags, height }: { flags: InteractionFlags<TextFieldFlags>; height?: number }) => (
    <div
        style={{
            width: FIELD_WIDTH,
            height,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

export const Fixed = () => {
    const [value, setValue] = useState("");

    return (
        <>
            <TextArea
                id="field"
                ariaLabel="Notes"
                padding={FIELD_PADDING}
                valueState={[value, setValue]}
                computeTextStyle={() => TEXT_STYLE}
                renderContent={(flags) => <Frame flags={flags} height={FIXED_HEIGHT} />}
            />
            <output data-readout="length">{`length: ${value.length}`}</output>
        </>
    );
};

export const AutoSizing = ({ maxRows }: { maxRows?: number }) => {
    const valueState = useState("");

    return (
        <TextArea
            id="field"
            ariaLabel="Message"
            isAutoSizing={true}
            minRows={MIN_ROWS}
            maxRows={maxRows}
            padding={FIELD_PADDING}
            valueState={valueState}
            computeTextStyle={() => TEXT_STYLE}
            renderContent={(flags) => <Frame flags={flags} />}
        />
    );
};

export const Capped = () => <AutoSizing maxRows={MAX_ROWS} />;

export const ReadOnly = () => {
    const valueState = useState("Can be read,\nnot changed");

    return (
        <TextArea
            id="field"
            ariaLabel="Terms"
            isReadOnly={true}
            padding={FIELD_PADDING}
            valueState={valueState}
            computeTextStyle={() => TEXT_STYLE}
            renderContent={(flags) => <Frame flags={flags} height={FIXED_HEIGHT} />}
        />
    );
};

export const Disabled = () => {
    const valueState = useState("Nothing gets in");

    return (
        <TextArea
            id="field"
            ariaLabel="Locked"
            isDisabled={true}
            padding={FIELD_PADDING}
            valueState={valueState}
            computeTextStyle={() => TEXT_STYLE}
            renderContent={(flags) => <Frame flags={flags} height={FIXED_HEIGHT} />}
        />
    );
};
