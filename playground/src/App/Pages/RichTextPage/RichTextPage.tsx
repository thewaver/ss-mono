import { createMemo, createSignal } from "solid-js";

import { TextArea } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField } from "../../StyledComponents/Field/Field";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { CustomInputExample } from "./Examples/CustomInput";
import { CustomTagsExample } from "./Examples/CustomTags";
import { DefaultTagsExample } from "./Examples/DefaultTags";
import { FIELD_WIDTH, MAX_ROWS, MIN_ROWS, PREVIEW_WIDTH, STARTING_CONTENT } from "./RichTextPage.const";

import { MEASURE_BOX_PADDING } from "../../PageComponents/MeasureBox/MeasureBox.css";
import { FIELD_GAP, FIELD_PADDING } from "../../StyledComponents/TextFieldContent/TextFieldContent.css";
import * as styles from "./RichTextPage.css";

const EXAMPLES_ROOT = "/src/App/Pages/RichTextPage/Examples";

export const RichTextPage = () => {
    const contentSignal = createSignal(STARTING_CONTENT);
    const [getRemoveOtherTags, setRemoveOtherTags] = createSignal(false);

    const getExamples = createMemo(() => [
        {
            key: "defaultTags",
            name: "Default Tags",
            component: () => <DefaultTagsExample />,
            path: `${EXAMPLES_ROOT}/DefaultTags.tsx`,
        },
        {
            key: "customTags",
            name: "Custom Tags",
            component: () => <CustomTagsExample />,
            path: `${EXAMPLES_ROOT}/CustomTags.tsx`,
        },
        {
            key: "customInput",
            name: "Custom Input",
            component: () => (
                <>
                    <TextArea
                        valueSignal={contentSignal}
                        isAutoSizing={true}
                        minRows={() => MIN_ROWS}
                        maxRows={() => MAX_ROWS}
                        padding={() => FIELD_PADDING}
                        gap={() => FIELD_GAP}
                        ariaLabel={"Tagged text"}
                        computeTextStyle={computePageTextFieldTextStyle}
                        renderContent={(getFlags) => (
                            <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} isStretched={true} />
                        )}
                        renderPlaceholder={(getFlags) => (
                            <PageTextFieldPlaceholder flags={getFlags} isTopAligned={true}>
                                Write something with tags in it
                            </PageTextFieldPlaceholder>
                        )}
                    />

                    <PageMeasureBox width={() => PREVIEW_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <CustomInputExample content={contentSignal[0]} removeOtherTags={getRemoveOtherTags} />
                    </PageMeasureBox>
                </>
            ),
            path: `${EXAMPLES_ROOT}/CustomInput.tsx`,
        },
    ]);

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"removeOtherTags"} label={"Remove other tags"}>
                    <PageCheckField
                        value={getRemoveOtherTags}
                        ariaLabel={"Remove other tags"}
                        onChange={setRemoveOtherTags}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
