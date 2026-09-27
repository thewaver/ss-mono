import { useState } from "react";

import { RICH_TEXT_DEFAULTS, TextArea } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground-core/App/PageComponents/MeasureBox/MeasureBox.css";
import {
    FIELD_WIDTH,
    MAX_ROWS,
    MIN_ROWS,
    PREVIEW_WIDTH,
    STARTING_CONTENT,
} from "@thewaver/ss-playground-core/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/RichTextPage/RichTextPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField } from "../../PageComponents/Field/Field";
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

const EXAMPLES_ROOT = "/src/App/Pages/RichTextPage/Examples";

export const RichTextPage = () => {
    const contentState = useState(STARTING_CONTENT);
    const [removeOtherTags, setRemoveOtherTags] = useState(RICH_TEXT_DEFAULTS.removeOtherTags);

    const examples = [
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
            key: "glossary",
            name: "Glossary",
            component: () => <GlossaryExample />,
            path: `${EXAMPLES_ROOT}/Glossary.tsx`,
        },
        {
            key: "links",
            name: "Links",
            component: () => <LinksExample />,
            path: `${EXAMPLES_ROOT}/Links.tsx`,
        },
        {
            key: "customInput",
            name: "Custom Input",
            component: () => (
                <>
                    <TextArea
                        valueState={contentState}
                        isAutoSizing={true}
                        minRows={MIN_ROWS}
                        maxRows={MAX_ROWS}
                        padding={FIELD_PADDING}
                        gap={FIELD_GAP}
                        ariaLabel={"Tagged text"}
                        computeTextStyle={computePageTextFieldTextStyle}
                        renderContent={(flags) => (
                            <PageTextFieldContent flags={flags} width={FIELD_WIDTH} isStretched={true} />
                        )}
                        renderPlaceholder={(flags) => (
                            <PageTextFieldPlaceholder flags={flags} isTopAligned={true}>
                                Write something with tags in it
                            </PageTextFieldPlaceholder>
                        )}
                    />

                    <PageMeasureBox width={PREVIEW_WIDTH} padding={MEASURE_BOX_PADDING}>
                        <CustomInputExample content={contentState[0]} removeOtherTags={removeOtherTags} />
                    </PageMeasureBox>
                </>
            ),
            path: `${EXAMPLES_ROOT}/CustomInput.tsx`,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"removeOtherTags"}
                    label={"Remove other tags"}
                    hint={
                        "Strips any tag the editor was not told to keep, rather than leaving it in the markup untouched."
                    }
                >
                    <PageCheckField
                        value={removeOtherTags}
                        ariaLabel={"Remove other tags"}
                        onChange={setRemoveOtherTags}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </div>
    );
};
