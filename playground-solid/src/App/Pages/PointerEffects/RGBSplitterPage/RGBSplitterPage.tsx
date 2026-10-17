import { createMemo, createSignal } from "solid-js";

import { RGB_SPLITTER_DEFAULTS } from "@thewaver/ss-components-solid";
import { RGBSplitterKnobs } from "@thewaver/ss-playground/App/Knobs/RGBSplitters.const";
import {
    BOX_HEIGHT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { HeadlineExample } from "./Examples/Headline";
import { PhotoExample } from "./Examples/Photo";
import type { RGBSplitterExampleProps } from "./RGBSplitterPageSolid.types";

export const RGBSplitterPage = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(RGBSplitterKnobs.STARTING_IS_DISABLED);
    const [getSmoothingMs, setSmoothingMs] = createSignal(RGB_SPLITTER_DEFAULTS.smoothingMs);
    const [getActiveRangePx, setActiveRangePx] = createSignal(RGBSplitterKnobs.STARTING_ACTIVE_RANGE_PX);
    const [getSplitRangePx, setSplitRangePx] = createSignal(RGB_SPLITTER_DEFAULTS.splitRangePx);
    const [getMaxOffsetPx, setMaxOffsetPx] = createSignal(RGB_SPLITTER_DEFAULTS.maxOffsetPx);
    const [getColorMixingChoice, setColorMixingChoice] = createSignal<
        (typeof RGBSplitterKnobs.COLOR_MIXING_CHOICES)[number]
    >(RGBSplitterKnobs.FROM_COLOR_SCHEME);

    const getColorMixing = () => {
        const choice = getColorMixingChoice();

        return choice === RGBSplitterKnobs.FROM_COLOR_SCHEME ? undefined : choice;
    };

    const getExamples = createMemo(() => {
        const commonProps: RGBSplitterExampleProps = {
            isDisabled: getIsDisabled,
            activeRangePx: getActiveRangePx,
            smoothingMs: getSmoothingMs,
            splitRangePx: getSplitRangePx,
            maxOffsetPx: getMaxOffsetPx,
            colorMixing: getColorMixing,
        };

        return [
            {
                key: "photo",
                name: EXAMPLE_NAMES.photo,
                readout: () =>
                    "the channels pull apart as the pointer heads for the middle — leave and come back, and each takes a new direction",
                component: () => (
                    <PageMeasureBox isFilling height={BOX_HEIGHT}>
                        <PhotoExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Photo.tsx`,
            },
            {
                key: "headline",
                name: EXAMPLE_NAMES.headline,
                readout: () => "type on a transparent ground, so the fringes fall straight onto the page",
                component: () => (
                    <PageMeasureBox isFilling height={BOX_HEIGHT}>
                        <HeadlineExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Headline.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Stops the content answering the pointer and leaves it whole. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    key={"smoothingMs"}
                    label={"Smoothing (ms)"}
                    hint={
                        "How long the split takes to catch up with the pointer. At 0 it follows exactly; raised, the channels glide apart and back together."
                    }
                >
                    <PageNumberField
                        value={getSmoothingMs}
                        min={RGBSplitterKnobs.MIN_SMOOTHING_MS}
                        max={RGBSplitterKnobs.MAX_SMOOTHING_MS}
                        step={RGBSplitterKnobs.SMOOTHING_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Smoothing in milliseconds"}
                        onInput={setSmoothingMs}
                    />
                </PageProp>

                <PageProp
                    key={"activeRangePx"}
                    label={"Active range (px)"}
                    hint={
                        "How near the pointer has to be before the content answers it at all, measured from its center. Outside it the content stays whole."
                    }
                >
                    <PageNumberField
                        value={getActiveRangePx}
                        min={RGBSplitterKnobs.MIN_ACTIVE_RANGE_PX}
                        max={RGBSplitterKnobs.MAX_ACTIVE_RANGE_PX}
                        step={RGBSplitterKnobs.ACTIVE_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Active range in pixels"}
                        onInput={setActiveRangePx}
                    />
                </PageProp>

                <PageProp
                    key={"splitRangePx"}
                    label={"Split range (px)"}
                    hint={"How far the split reaches. Widest with the pointer on the center, closed out here."}
                >
                    <PageNumberField
                        value={getSplitRangePx}
                        min={RGBSplitterKnobs.MIN_SPLIT_RANGE_PX}
                        max={RGBSplitterKnobs.MAX_SPLIT_RANGE_PX}
                        step={RGBSplitterKnobs.SPLIT_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Split range in pixels"}
                        onInput={setSplitRangePx}
                    />
                </PageProp>

                <PageProp
                    key={"maxOffsetPx"}
                    label={"Max offset (px)"}
                    hint={
                        "The furthest any one channel is shifted, with the pointer on the center. Each channel picks a random direction and distance within it every time the split opens."
                    }
                >
                    <PageNumberField
                        value={getMaxOffsetPx}
                        min={RGBSplitterKnobs.MIN_OFFSET_PX}
                        max={RGBSplitterKnobs.MAX_OFFSET_PX}
                        step={RGBSplitterKnobs.OFFSET_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Maximum offset in pixels"}
                        onInput={setMaxOffsetPx}
                    />
                </PageProp>

                <PageProp
                    key={"colorMixing"}
                    label={"Color mixing"}
                    hint={
                        "How the channels are put back together. Additive fringes are red, green and blue and read on a dark ground; subtractive ones are cyan, magenta and yellow and read on a light one. Left out, it follows the page's color-scheme each time the split opens."
                    }
                >
                    <PageSelectField
                        value={getColorMixingChoice}
                        values={RGBSplitterKnobs.COLOR_MIXING_CHOICES}
                        ariaLabel={"Color mixing"}
                        onChange={setColorMixingChoice}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
