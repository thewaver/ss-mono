import { useState } from "react";

import { EDGE_FADER_DEFAULTS } from "@thewaver/ss-components-react";
import { EdgeFaderKnobs } from "@thewaver/ss-playground/App/Knobs/EdgeFaders.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { CardExample } from "./Examples/Card";
import { ColumnExample } from "./Examples/Column";
import { GridExample } from "./Examples/Grid";
import { StripExample } from "./Examples/Strip";

const EXAMPLES_ROOT = "/src/App/Pages/EdgeFaderPage/Examples";

export const EdgeFaderPage = () => {
    const [size, setSize] = useState(EDGE_FADER_DEFAULTS.size);
    const [isScrollAware, setIsScrollAware] = useState(EDGE_FADER_DEFAULTS.isScrollAware);

    const modeText = isScrollAware
        ? "a side fades only while there is more past it, and sharpens as that end arrives"
        : "the chosen sides are faded wherever the scroll stands";

    const examples = [
        {
            key: "column",
            name: "Top and bottom",
            readout: () => `a scrolling column — ${modeText}`,
            component: () => <ColumnExample size={size} isScrollAware={isScrollAware} />,
            path: `${EXAMPLES_ROOT}/Column.tsx`,
        },
        {
            key: "strip",
            name: "Left and right",
            readout: () => `a scrolling strip — ${modeText}`,
            component: () => <StripExample size={size} isScrollAware={isScrollAware} />,
            path: `${EXAMPLES_ROOT}/Strip.tsx`,
        },
        {
            key: "grid",
            name: "All four sides",
            readout: () => `scrolls both ways, and the two fades meet in the corners — ${modeText}`,
            component: () => <GridExample size={size} isScrollAware={isScrollAware} />,
            path: `${EXAMPLES_ROOT}/Grid.tsx`,
        },
        {
            key: "card",
            name: "Something that does not scroll",
            readout: () =>
                isScrollAware
                    ? "nothing is out of view, so nothing fades"
                    : "the fade does not need a scroll to be drawn",
            component: () => <CardExample size={size} isScrollAware={isScrollAware} />,
            path: `${EXAMPLES_ROOT}/Card.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"size"}
                    label={"Fade size (px)"}
                    hint={"How far in from each side the fade reaches."}
                >
                    <PageNumberField
                        value={size}
                        min={EdgeFaderKnobs.MIN_SIZE}
                        max={EdgeFaderKnobs.MAX_SIZE}
                        step={EdgeFaderKnobs.SIZE_STEP}
                        ariaLabel={"Fade size"}
                        onInput={setSize}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isScrollAware"}
                    label={"Scroll-aware"}
                    hint={"Whether a side fades only while there is more to scroll to past it."}
                >
                    <PageCheckField value={isScrollAware} ariaLabel={"Scroll-aware"} onChange={setIsScrollAware} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={360} />
        </>
    );
};
