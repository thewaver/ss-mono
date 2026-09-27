import { Range } from "@thewaver/ss-components-react";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangePriceExampleProps } from "../RangePage.types";

const MIN = 0;
const MAX = 500;
const STEP = 10;

const PRICE_FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type Props = RangePriceExampleProps;

export const PriceExample = (props: Props) => (
    <Range
        rangeState={props.rangeState}
        id={"price"}
        ariaLabel={"Price range"}
        thumbLabels={["Lowest price", "Highest price"]}
        min={MIN}
        max={MAX}
        step={STEP}
        thumbSize={RANGE_THUMB_SIZE}
        computeValueText={(value) => PRICE_FORMAT.format(value)}
        renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
        onChangeEnd={props.onChangeEnd}
    />
);
