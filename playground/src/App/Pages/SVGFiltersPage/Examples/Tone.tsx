import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";

import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../../StyledComponents/Field/Field";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTone";
const MIN_AMOUNT = 0;
const MAX_AMOUNT = 3;
const AMOUNT_STEP = 0.05;
const MIN_INVERSION = 0;
const MAX_INVERSION = 1;
const INVERSION_STEP = 0.05;

const STARTING_BRIGHTNESS = 1.2;
const STARTING_CONTRAST = 1.4;
const STARTING_INVERSION = 0;

type Props = SVGFiltersExampleProps;

export const ToneExample = (props: Props) => {
    const [getBrightness, setBrightness] = createSignal(STARTING_BRIGHTNESS);
    const [getContrast, setContrast] = createSignal(STARTING_CONTRAST);
    const [getInversion, setInversion] = createSignal(STARTING_INVERSION);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"tone"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addBrightnessFilter({ amount: getBrightness() })
                        .addContrastFilter({ amount: getContrast() })
                        .addInversionFilter({ amount: getInversion() })
                        .computeFilterPrimitives({
                            method: access(props.method),
                            elementSize: access(props.elementSize),
                        })
                }
            />

            <PagePropsPanel scope={"local"}>
                <PageProp key={"brightness"} label={"Brightness"}>
                    <PageNumberField
                        value={getBrightness}
                        min={() => MIN_AMOUNT}
                        max={() => MAX_AMOUNT}
                        step={() => AMOUNT_STEP}
                        ariaLabel={"Brightness"}
                        onInput={setBrightness}
                    />
                </PageProp>

                <PageProp key={"contrast"} label={"Contrast"}>
                    <PageNumberField
                        value={getContrast}
                        min={() => MIN_AMOUNT}
                        max={() => MAX_AMOUNT}
                        step={() => AMOUNT_STEP}
                        ariaLabel={"Contrast"}
                        onInput={setContrast}
                    />
                </PageProp>

                <PageProp key={"inversion"} label={"Inversion"}>
                    <PageNumberField
                        value={getInversion}
                        min={() => MIN_INVERSION}
                        max={() => MAX_INVERSION}
                        step={() => INVERSION_STEP}
                        ariaLabel={"Inversion"}
                        onInput={setInversion}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};
