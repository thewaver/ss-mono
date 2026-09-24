import { createMemo, createSignal } from "solid-js";

import { EDGE_FADER_DEFAULTS } from "@thewaver/ss-components";

import { EdgeFaderKnobs } from "../../Knobs/EdgeFaders.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { CardExample } from "./Examples/Card";
import { ColumnExample } from "./Examples/Column";
import { GridExample } from "./Examples/Grid";
import { StripExample } from "./Examples/Strip";

const EXAMPLES_ROOT = "/src/App/Pages/EdgeFaderPage/Examples";

export const EdgeFaderPage = () => {
    const [getSize, setSize] = createSignal(EDGE_FADER_DEFAULTS.size);
    const [getIsScrollAware, setIsScrollAware] = createSignal(EDGE_FADER_DEFAULTS.isScrollAware);

    const getModeText = () =>
        getIsScrollAware()
            ? "a side fades only while there is more past it, and sharpens as that end arrives"
            : "the chosen sides are faded wherever the scroll stands";

    const getExamples = createMemo(() => [
        {
            key: "column",
            name: "Top and bottom",
            readout: () => `a scrolling column — ${getModeText()}`,
            component: () => <ColumnExample size={getSize} isScrollAware={getIsScrollAware} />,
            path: `${EXAMPLES_ROOT}/Column.tsx`,
        },
        {
            key: "strip",
            name: "Left and right",
            readout: () => `a scrolling strip — ${getModeText()}`,
            component: () => <StripExample size={getSize} isScrollAware={getIsScrollAware} />,
            path: `${EXAMPLES_ROOT}/Strip.tsx`,
        },
        {
            key: "grid",
            name: "All four sides",
            readout: () => `scrolls both ways, and the two fades meet in the corners — ${getModeText()}`,
            component: () => <GridExample size={getSize} isScrollAware={getIsScrollAware} />,
            path: `${EXAMPLES_ROOT}/Grid.tsx`,
        },
        {
            key: "card",
            name: "Something that does not scroll",
            readout: () =>
                getIsScrollAware()
                    ? "nothing is out of view, so nothing fades"
                    : "the fade does not need a scroll to be drawn",
            component: () => <CardExample size={getSize} isScrollAware={getIsScrollAware} />,
            path: `${EXAMPLES_ROOT}/Card.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"size"} label={"Fade size (px)"} hint={"How far in from each side the fade reaches."}>
                    <PageNumberField
                        value={getSize}
                        min={() => EdgeFaderKnobs.MIN_SIZE}
                        max={() => EdgeFaderKnobs.MAX_SIZE}
                        step={() => EdgeFaderKnobs.SIZE_STEP}
                        ariaLabel={"Fade size"}
                        onInput={setSize}
                    />
                </PageProp>

                <PageProp
                    key={"isScrollAware"}
                    label={"Scroll-aware"}
                    hint={"Whether a side fades only while there is more to scroll to past it."}
                >
                    <PageCheckField value={getIsScrollAware} ariaLabel={"Scroll-aware"} onChange={setIsScrollAware} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} minColumnWidth={360} />
        </>
    );
};
