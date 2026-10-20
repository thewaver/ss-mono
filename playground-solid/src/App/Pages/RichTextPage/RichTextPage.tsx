import { createMemo, createSignal } from "solid-js";

import { RICH_TEXT_DEFAULTS, TextArea } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import {
    DEPTH_STEP,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    MAX_DEPTH_KNOB,
    MAX_ROWS,
    MIN_ROWS,
    NO_DEPTH_LIMIT,
    PREVIEW_WIDTH,
    STARTING_CONTENT,
} from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { CustomInputExample } from "./Examples/CustomInput";
import { CustomTagsExample } from "./Examples/CustomTags";
import { DefaultTagsExample } from "./Examples/DefaultTags";
import { GlossaryExample } from "./Examples/Glossary";
import { LinksExample } from "./Examples/Links";

export const RichTextPage = () => {
    const contentSignal = createSignal(STARTING_CONTENT);
    const [getRemoveOtherTags, setRemoveOtherTags] = createSignal(RICH_TEXT_DEFAULTS.removeOtherTags);
    const [getMaxDepth, setMaxDepth] = createSignal(NO_DEPTH_LIMIT);

    const getMaxDepthProp = () => (getMaxDepth() === NO_DEPTH_LIMIT ? Infinity : getMaxDepth());

    const getExamples = createMemo(() => [
        {
            key: "defaultTags",
            name: EXAMPLE_NAMES.defaultTags,
            component: () => <DefaultTagsExample />,
            path: `${EXAMPLES_ROOT}/DefaultTags.tsx`,
        },
        {
            key: "customTags",
            name: EXAMPLE_NAMES.customTags,
            component: () => <CustomTagsExample />,
            path: `${EXAMPLES_ROOT}/CustomTags.tsx`,
        },
        {
            key: "glossary",
            name: EXAMPLE_NAMES.glossary,
            component: () => <GlossaryExample />,
            path: `${EXAMPLES_ROOT}/Glossary.tsx`,
        },
        {
            key: "links",
            name: EXAMPLE_NAMES.links,
            component: () => <LinksExample />,
            path: `${EXAMPLES_ROOT}/Links.tsx`,
        },
        {
            key: "customInput",
            name: EXAMPLE_NAMES.customInput,
            component: () => (
                <>
                    <TextArea
                        value={contentSignal}
                        isAutoSizing={true}
                        minRows={MIN_ROWS}
                        maxRows={MAX_ROWS}
                        padding={FIELD_PADDING}
                        gap={FIELD_GAP}
                        ariaLabel={"Tagged text"}
                        computeTextStyle={computePageTextFieldTextStyle}
                        renderContent={(getFlags) => (
                            <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} isStretched={true} />
                        )}
                        renderPlaceholder={(getFlags) => (
                            <PageTextFieldPlaceholder flags={getFlags} isTopAligned={true}>
                                Write something with tags in it
                            </PageTextFieldPlaceholder>
                        )}
                    />

                    <PageMeasureBox width={PREVIEW_WIDTH} padding={MEASURE_BOX_PADDING}>
                        <CustomInputExample
                            content={contentSignal[0]}
                            removeOtherTags={getRemoveOtherTags}
                            maxDepth={getMaxDepthProp}
                        />
                    </PageMeasureBox>
                </>
            ),
            path: `${EXAMPLES_ROOT}/CustomInput.tsx`,
        },
    ]);

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"removeOtherTags"}
                    label={"Remove other tags"}
                    hint={
                        "Strips any tag the editor was not told to keep, rather than leaving it in the markup untouched."
                    }
                    controls={"Sets RichTextProps.removeOtherTags"}
                >
                    <PageCheckField
                        value={getRemoveOtherTags}
                        ariaLabel={"Remove other tags"}
                        onChange={setRemoveOtherTags}
                    />
                </PageProp>

                <PageProp
                    key={"maxDepth"}
                    label={"Max depth (-1 = no limit)"}
                    hint={"How deeply tags may nest. A tag deeper than this prints as typed, and 0 allows no tags."}
                    controls={"Sets RichTextProps.maxDepth, with -1 sent as Infinity"}
                >
                    <PageNumberField
                        value={getMaxDepth}
                        min={NO_DEPTH_LIMIT}
                        max={MAX_DEPTH_KNOB}
                        step={DEPTH_STEP}
                        ariaLabel={"Max depth"}
                        onInput={setMaxDepth}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
