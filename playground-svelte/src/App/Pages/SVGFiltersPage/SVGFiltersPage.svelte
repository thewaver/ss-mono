<script lang="ts">
    import { SVGFilterDefs } from "@thewaver/ss-components-svelte";
    import type { SVGFilterMethod, SortableItem } from "@thewaver/ss-components-svelte";
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";
    import { APPLIED_STEPS } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
    import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
    import { SUBJECT_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SVGFiltersContent/SVGFiltersContent.css";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BlurExample from "./Examples/Blur.svelte";
    import DropShadowExample from "./Examples/DropShadow.svelte";
    import HueExample from "./Examples/Hue.svelte";
    import StackExample from "./Examples/Stack.svelte";
    import ToneExample from "./Examples/Tone.svelte";
    import TurbulenceExample from "./Examples/Turbulence.svelte";
    import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/SVGFiltersPage/Examples";

    const names = (items: SortableItem<SVGFiltersStep>[]) =>
        items.map((item) => item.value.name).join(" → ") || "nothing";

    let method = $state<SVGFilterMethod>(SVGFilterKnobs.STARTING_METHOD);
    let isSizedFromElement = $state(SVGFilterKnobs.STARTING_IS_SIZED_FROM_ELEMENT);

    let applied = $state.raw<SortableItem<SVGFiltersStep>[]>(APPLIED_STEPS);
    let unused = $state.raw<SortableItem<SVGFiltersStep>[]>([]);

    const elementSize = $derived(isSizedFromElement ? SUBJECT_SIZE : undefined);

    const commonProps: SVGFiltersExampleProps = $derived({
        method,
        elementSize,
    });

    const examples: ExampleDefs[] = [
        {
            key: "blur",
            name: "Blur",
            component: blurExample,
            path: `${EXAMPLES_ROOT}/Blur.svelte`,
        },
        {
            key: "dropShadow",
            name: "Drop shadow",
            component: dropShadowExample,
            path: `${EXAMPLES_ROOT}/DropShadow.svelte`,
        },
        {
            key: "turbulence",
            name: "Turbulence",
            component: turbulenceExample,
            path: `${EXAMPLES_ROOT}/Turbulence.svelte`,
        },
        {
            key: "hue",
            name: "Hue",
            component: hueExample,
            path: `${EXAMPLES_ROOT}/Hue.svelte`,
        },
        {
            key: "tone",
            name: "Tone",
            component: toneExample,
            path: `${EXAMPLES_ROOT}/Tone.svelte`,
        },
        {
            key: "stack",
            name: "Four at once",
            readout: () =>
                method === "chain"
                    ? `${names(applied)} — chained, so each one is handed what the one before it produced and the order is the effect`
                    : `${names(applied)} — isolated, so every one reads the original and the order only decides what sits on top`,
            component: stackExample,
            path: `${EXAMPLES_ROOT}/Stack.svelte`,
        },
    ];
</script>

{#snippet blurExample()}
    <BlurExample {...commonProps} />
{/snippet}

{#snippet dropShadowExample()}
    <DropShadowExample {...commonProps} />
{/snippet}

{#snippet turbulenceExample()}
    <TurbulenceExample {...commonProps} />
{/snippet}

{#snippet hueExample()}
    <HueExample {...commonProps} />
{/snippet}

{#snippet toneExample()}
    <ToneExample {...commonProps} />
{/snippet}

{#snippet stackExample()}
    <StackExample {...commonProps} bind:applied bind:unused />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"method"}
        label={"Method"}
        hint={"Whether each step is fed the result of the one before it, or each works from the original and the results are combined."}
    >
        <PageSelectField
            value={method}
            values={SVGFilterDefs.METHODS}
            ariaLabel={"Method"}
            onChange={(value) => (method = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"elementSize"}
        label={"Region sized from the element"}
        hint={"Sizes the area the filter is allowed to paint in from the element itself, rather than from a fixed region."}
    >
        <PageCheckField
            value={isSizedFromElement}
            ariaLabel={"Region sized from the element"}
            onChange={(value) => (isSizedFromElement = value)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
