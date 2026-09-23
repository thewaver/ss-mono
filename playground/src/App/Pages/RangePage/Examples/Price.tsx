import { Range } from "@thewaver/ss-components";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangePriceExampleProps } from "../RangePage.types";

import { RANGE_THUMB_SIZE } from "../../../StyledComponents/RangeContent/RangeContent.css";

const MIN = 0;
const MAX = 500;
const STEP = 10;

const PRICE_FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type Props = RangePriceExampleProps;

export const PriceExample = (props: Props) => (
    <Range
        rangeSignal={props.rangeSignal}
        id={"price"}
        ariaLabel={"Price range"}
        thumbLabels={() => ["Lowest price", "Highest price"]}
        min={() => MIN}
        max={() => MAX}
        step={() => STEP}
        thumbSize={() => RANGE_THUMB_SIZE}
        computeValueText={(value) => PRICE_FORMAT.format(value)}
        renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
        onChangeEnd={props.onChangeEnd}
    />
);
