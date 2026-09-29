<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";
    import { TagInputKnobs } from "@thewaver/ss-playground/App/Knobs/TagInputs.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import CrowdedExample from "./Examples/Crowded.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import UniqueExample from "./Examples/Unique.svelte";
    import type { TagInputExampleProps } from "./TagInputPage.types";

    const NARROW_WIDTH = 240;
    const EXAMPLES_ROOT = "/src/App/Pages/TagInputPage/Examples";

    const STARTING_TAGS = ["solid", "vanilla-extract"];
    const CROWDED_TAGS = [
        "solid",
        "vanilla-extract",
        "playwright",
        "typescript",
        "vite",
        "eslint",
        "prettier",
        "vitest",
        "aria",
        "tokens",
        "signals",
        "stores",
    ];

    let isDisabled = $state(TagInputKnobs.STARTING_IS_DISABLED);
    let hasError = $state(TagInputKnobs.STARTING_HAS_ERROR);

    let defaultValue = $state.raw(STARTING_TAGS);
    let uniqueValue = $state.raw(STARTING_TAGS);
    let crowdedValue = $state.raw(CROWDED_TAGS);
    let emptyValue = $state.raw<string[]>([]);

    const reset = () => {
        defaultValue = STARTING_TAGS;
        uniqueValue = STARTING_TAGS;
        crowdedValue = CROWDED_TAGS;
        emptyValue = [];
    };

    const commonProps: Omit<TagInputExampleProps, "value"> = $derived({
        isDisabled,
        hasError,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `tags: ${defaultValue.join(", ") || "none"}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "empty",
            name: "Empty",
            readout: () => `tags: ${emptyValue.join(", ") || "none"}`,
            component: emptyExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "unique",
            name: "Refusing duplicates",
            readout: () => `tags: ${uniqueValue.join(", ") || "none"} — the same word twice is refused`,
            component: uniqueExample,
            path: `${EXAMPLES_ROOT}/Unique.svelte`,
        },
        {
            key: "crowded",
            name: "Crowded and narrow",
            readout: () => `${crowdedValue.length} tags in ${NARROW_WIDTH}px — they wrap and the box grows with them`,
            component: crowdedExample,
            path: `${EXAMPLES_ROOT}/Crowded.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} bind:value={defaultValue} />
{/snippet}

{#snippet emptyExample()}
    <DefaultExample {...commonProps} bind:value={emptyValue} ariaLabel={"Empty topics"} />
{/snippet}

{#snippet uniqueExample()}
    <UniqueExample {...commonProps} bind:value={uniqueValue} />
{/snippet}

{#snippet crowdedExample()}
    <CrowdedExample {...commonProps} bind:value={crowdedValue} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Turns the field off: no tag can be added, and none can be removed."}
    >
        <PageCheckField
            value={isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                isDisabled = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"hasError"}
        label={"Error"}
        hint={"Puts the field into its error look, without changing what it accepts."}
    >
        <PageCheckField
            value={hasError}
            ariaLabel={"Error"}
            onChange={(value) => {
                hasError = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"tags"} label={"Tags"} hint={"Puts the examples back to the tags they started with."}>
        <Button
            onClick={async () => {
                reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Reset</PageButtonContent>
            {/snippet}
        </Button>
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
