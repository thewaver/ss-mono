import { useState } from "react";

import { SVGFilterDefs } from "@thewaver/ss-components-react";
import type { SVGFilterMethod, SortableItem } from "@thewaver/ss-components-react";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";
import { APPLIED_STEPS } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import { SUBJECT_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SVGFiltersContent/SVGFiltersContent.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BlurExample } from "./Examples/Blur";
import { DropShadowExample } from "./Examples/DropShadow";
import { HueExample } from "./Examples/Hue";
import { StackExample } from "./Examples/Stack";
import { ToneExample } from "./Examples/Tone";
import { TurbulenceExample } from "./Examples/Turbulence";
import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/SVGFiltersPage/Examples";

const names = (items: SortableItem<SVGFiltersStep>[]) => items.map((item) => item.value.name).join(" → ") || "nothing";

export const SVGFiltersPage = () => {
    const [method, setMethod] = useState<SVGFilterMethod>(SVGFilterKnobs.STARTING_METHOD);
    const [isSizedFromElement, setIsSizedFromElement] = useState(SVGFilterKnobs.STARTING_IS_SIZED_FROM_ELEMENT);

    const appliedState = useState<SortableItem<SVGFiltersStep>[]>(APPLIED_STEPS);
    const unusedState = useState<SortableItem<SVGFiltersStep>[]>([]);

    const elementSize = isSizedFromElement ? SUBJECT_SIZE : undefined;

    const commonProps: SVGFiltersExampleProps = {
        method,
        elementSize,
    };

    const examples = [
        {
            key: "blur",
            name: "Blur",
            component: () => <BlurExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Blur.tsx`,
        },
        {
            key: "dropShadow",
            name: "Drop shadow",
            component: () => <DropShadowExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/DropShadow.tsx`,
        },
        {
            key: "turbulence",
            name: "Turbulence",
            component: () => <TurbulenceExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Turbulence.tsx`,
        },
        {
            key: "hue",
            name: "Hue",
            component: () => <HueExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Hue.tsx`,
        },
        {
            key: "tone",
            name: "Tone",
            component: () => <ToneExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Tone.tsx`,
        },
        {
            key: "stack",
            name: "Four at once",
            readout: () =>
                method === "chain"
                    ? `${names(appliedState[0])} — chained, so each one is handed what the one before it produced and the order is the effect`
                    : `${names(appliedState[0])} — isolated, so every one reads the original and the order only decides what sits on top`,
            component: () => <StackExample {...commonProps} appliedState={appliedState} unusedState={unusedState} />,
            path: `${EXAMPLES_ROOT}/Stack.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"method"}
                    label={"Method"}
                    hint={
                        "Whether each step is fed the result of the one before it, or each works from the original and the results are combined."
                    }
                >
                    <PageSelectField
                        value={method}
                        values={SVGFilterDefs.METHODS}
                        ariaLabel={"Method"}
                        onChange={setMethod}
                    />
                </PageProp>

                <PageProp
                    itemKey={"elementSize"}
                    label={"Region sized from the element"}
                    hint={
                        "Sizes the area the filter is allowed to paint in from the element itself, rather than from a fixed region."
                    }
                >
                    <PageCheckField
                        value={isSizedFromElement}
                        ariaLabel={"Region sized from the element"}
                        onChange={setIsSizedFromElement}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
