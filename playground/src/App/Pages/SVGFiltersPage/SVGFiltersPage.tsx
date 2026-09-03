import { createMemo, createSignal } from "solid-js";

import type { SVGFilterMethod, SortableItem } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageSelectField } from "../../StyledComponents/Field/Field";
import { BlurExample } from "./Examples/Blur";
import { DropShadowExample } from "./Examples/DropShadow";
import { HueExample } from "./Examples/Hue";
import { StackExample } from "./Examples/Stack";
import { ToneExample } from "./Examples/Tone";
import { TurbulenceExample } from "./Examples/Turbulence";
import { APPLIED_STEPS } from "./SVGFiltersPage.const";
import type { SVGFiltersExampleProps, SVGFiltersStep } from "./SVGFiltersPage.types";

import { SUBJECT_SIZE } from "../../StyledComponents/SVGFiltersContent/SVGFiltersContent.css";

const EXAMPLES_ROOT = "/src/App/Pages/SVGFiltersPage/Examples";

const METHODS: SVGFilterMethod[] = ["chain", "isolate"];

const names = (items: SortableItem<SVGFiltersStep>[]) => items.map((item) => item.value.name).join(" → ") || "nothing";

export const SVGFiltersPage = () => {
    const [getMethod, setMethod] = createSignal<SVGFilterMethod>("chain");
    const [getIsSizedFromElement, setIsSizedFromElement] = createSignal(true);

    const appliedSignal = createSignal(APPLIED_STEPS);
    const unusedSignal = createSignal<SortableItem<SVGFiltersStep>[]>([]);

    const getElementSize = () => (getIsSizedFromElement() ? SUBJECT_SIZE : undefined);

    const getExamples = createMemo(() => {
        const commonProps: SVGFiltersExampleProps = {
            method: getMethod,
            elementSize: getElementSize,
        };

        return [
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
                    getMethod() === "chain"
                        ? `${names(appliedSignal[0]())} — chained, so each one is handed what the one before it produced and the order is the effect`
                        : `${names(appliedSignal[0]())} — isolated, so every one reads the original and the order only decides what sits on top`,
                component: () => (
                    <StackExample {...commonProps} appliedSignal={appliedSignal} unusedSignal={unusedSignal} />
                ),
                path: `${EXAMPLES_ROOT}/Stack.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"method"} label={"Method"}>
                    <PageSelectField
                        value={getMethod}
                        values={() => METHODS}
                        ariaLabel={"Method"}
                        onChange={(method) => setMethod(() => method)}
                    />
                </PageProp>

                <PageProp key={"elementSize"} label={"Region sized from the element"}>
                    <PageCheckField
                        value={getIsSizedFromElement}
                        ariaLabel={"Region sized from the element"}
                        onChange={setIsSizedFromElement}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
