import { useState } from "react";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-react";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersPixelate";

type Props = SVGFiltersExampleProps;

export const PixelateExample = (props: Props) => {
    const [size, setSize] = useState(SVGFilterKnobs.Pixelate.STARTING_SIZE);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"pixelate"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID).addPixelateFilter({ size }).computeFilterPrimitives({
                        method: props.method,
                        elementSize: props.elementSize,
                    })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"pixelSize"}
                    label={"Square size (px)"}
                    hint={
                        "How wide each square is. Each takes the color at its own middle; 1 leaves the picture alone."
                    }
                >
                    <PageNumberField
                        value={size}
                        min={SVGFilterKnobs.Pixelate.MIN_SIZE}
                        max={SVGFilterKnobs.Pixelate.MAX_SIZE}
                        step={SVGFilterKnobs.Pixelate.SIZE_STEP}
                        ariaLabel={"Square size in pixels"}
                        onInput={setSize}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
