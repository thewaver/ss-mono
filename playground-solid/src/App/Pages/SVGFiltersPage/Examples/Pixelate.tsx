import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components-solid";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersPixelate";

type Props = SVGFiltersExampleProps;

export const PixelateExample = (props: Props) => {
    const [getSize, setSize] = createSignal(SVGFilterKnobs.Pixelate.STARTING_SIZE);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"pixelate"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID).addPixelateFilter({ size: getSize() }).computeFilterPrimitives({
                        method: access(props.method),
                        elementSize: access(props.elementSize),
                    })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    key={"pixelSize"}
                    label={"Square size (px)"}
                    hint={
                        "How wide each square is. Each takes the color at its own middle; 1 leaves the picture alone."
                    }
                >
                    <PageNumberField
                        value={getSize}
                        min={() => SVGFilterKnobs.Pixelate.MIN_SIZE}
                        max={() => SVGFilterKnobs.Pixelate.MAX_SIZE}
                        step={() => SVGFilterKnobs.Pixelate.SIZE_STEP}
                        ariaLabel={"Square size in pixels"}
                        onInput={setSize}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
