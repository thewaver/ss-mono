<script lang="ts">
    import { RICH_TEXT_DEFAULTS, TextArea } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import {
        FIELD_WIDTH,
        MAX_ROWS,
        MIN_ROWS,
        PREVIEW_WIDTH,
        STARTING_CONTENT,
    } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import CustomInputExample from "./Examples/CustomInput.svelte";
    import CustomTagsExample from "./Examples/CustomTags.svelte";
    import DefaultTagsExample from "./Examples/DefaultTags.svelte";
    import GlossaryExample from "./Examples/Glossary.svelte";
    import LinksExample from "./Examples/Links.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/RichTextPage/Examples";

    let content = $state(STARTING_CONTENT);
    let removeOtherTags = $state(RICH_TEXT_DEFAULTS.removeOtherTags);

    const examples: ExampleDefs[] = [
        {
            key: "defaultTags",
            name: "Default Tags",
            component: defaultTagsExample,
            path: `${EXAMPLES_ROOT}/DefaultTags.svelte`,
        },
        {
            key: "customTags",
            name: "Custom Tags",
            component: customTagsExample,
            path: `${EXAMPLES_ROOT}/CustomTags.svelte`,
        },
        {
            key: "glossary",
            name: "Glossary",
            component: glossaryExample,
            path: `${EXAMPLES_ROOT}/Glossary.svelte`,
        },
        {
            key: "links",
            name: "Links",
            component: linksExample,
            path: `${EXAMPLES_ROOT}/Links.svelte`,
        },
        {
            key: "customInput",
            name: "Custom Input",
            component: customInputExample,
            path: `${EXAMPLES_ROOT}/CustomInput.svelte`,
        },
    ];
</script>

{#snippet defaultTagsExample()}
    <DefaultTagsExample />
{/snippet}

{#snippet customTagsExample()}
    <CustomTagsExample />
{/snippet}

{#snippet glossaryExample()}
    <GlossaryExample />
{/snippet}

{#snippet linksExample()}
    <LinksExample />
{/snippet}

{#snippet customInputExample()}
    <TextArea
        bind:value={content}
        isAutoSizing={true}
        minRows={MIN_ROWS}
        maxRows={MAX_ROWS}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Tagged text"}
        computeTextStyle={computePageTextFieldTextStyle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} isStretched={true} />
        {/snippet}

        {#snippet renderPlaceholder(flags)}
            <PageTextFieldPlaceholder {flags} isTopAligned={true}>
                Write something with tags in it
            </PageTextFieldPlaceholder>
        {/snippet}
    </TextArea>

    <PageMeasureBox width={PREVIEW_WIDTH} padding={MEASURE_BOX_PADDING}>
        <CustomInputExample {content} {removeOtherTags} />
    </PageMeasureBox>
{/snippet}

<div class={styles.root}>
    <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"removeOtherTags"}
            label={"Remove other tags"}
            hint={"Strips any tag the editor was not told to keep, rather than leaving it in the markup untouched."}
        >
            <PageCheckField
                value={removeOtherTags}
                ariaLabel={"Remove other tags"}
                onChange={(value) => {
                    removeOtherTags = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples items={examples} layout={"flow"} />
</div>
