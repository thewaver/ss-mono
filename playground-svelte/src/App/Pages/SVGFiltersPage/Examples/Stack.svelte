<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFiltersPage.css";

    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import { applyStep } from "../SVGFiltersPage.const";
    import type { SVGFiltersStackExampleProps } from "../SVGFiltersPage.types";
    import StepList from "./StepList.svelte";

    const FILTER_ID = "svgFiltersStack";

    type Props = SVGFiltersStackExampleProps;

    let { applied = $bindable(), unused = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.stack}>
    <PageFilterStage
        filterId={FILTER_ID}
        label={"stack"}
        renderDefs={() => {
            const factory = new SVGFilterDefsFactory(FILTER_ID);

            for (const item of applied) applyStep(factory, item.value.id);

            return factory.computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            });
        }}
    />

    <div class={styles.stepLists}>
        <StepList bind:items={applied} caption={"Applied"} emptyText={"Nothing applied"} />

        <StepList bind:items={unused} caption={"Left out"} emptyText={"Drop here"} />
    </div>
</div>
