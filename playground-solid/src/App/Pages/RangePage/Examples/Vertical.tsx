import { Range } from "@thewaver/ss-components-solid";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangeVerticalExampleProps } from "../RangePage.types";

const VERTICAL_LENGTH = 160;

type Props = RangeVerticalExampleProps;

export const VerticalExample = (props: Props) => (
    <PageControlRow>
        <Range
            valueSignal={props.valueSignal}
            id={"verticalVolume"}
            ariaLabel={"Vertical volume"}
            orientation={"vertical"}
            thumbSize={() => RANGE_THUMB_SIZE}
            renderContent={(getRenderProps) => (
                <PageRangeContent renderProps={getRenderProps} length={() => VERTICAL_LENGTH} />
            )}
        />

        <PageControlRowLabel>and a pair</PageControlRowLabel>

        <Range
            rangeSignal={props.rangeSignal}
            ariaLabel={"Vertical band"}
            thumbLabels={() => ["Band floor", "Band ceiling"]}
            orientation={"vertical"}
            thumbSize={() => RANGE_THUMB_SIZE}
            renderContent={(getRenderProps) => (
                <PageRangeContent renderProps={getRenderProps} length={() => VERTICAL_LENGTH} />
            )}
        />
    </PageControlRow>
);
