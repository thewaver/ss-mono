import { createSignal } from "solid-js";

import { Range } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import type { Span } from "@thewaver/ss-utils";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";

const MIN = 0;
const MAX = 500;
const STEP = 10;

const PRICE_FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const PricesDocsExample = () => {
    const rangeSignal = createSignal<Span>({ start: 100, end: 350 });
    const [getSettled, setSettled] = createSignal<number[]>();

    return (
        <>
            <Range
                range={rangeSignal}
                id={"price"}
                ariaLabel={"Price range"}
                thumbLabels={() => ["Lowest price", "Highest price"]}
                min={MIN}
                max={MAX}
                step={STEP}
                thumbSize={RANGE_THUMB_SIZE}
                computeValueText={(value) => PRICE_FORMAT.format(value)}
                renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
                onChangeEnd={setSettled}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Read out as: ${PRICE_FORMAT.format(rangeSignal[0]().start)} and ${PRICE_FORMAT.format(rangeSignal[0]().end)} | Settled: ${getSettled()?.join("–") ?? "not yet"}`}
            </div>
        </>
    );
};
