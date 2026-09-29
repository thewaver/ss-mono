<script lang="ts">
    import { LABEL_DEFAULTS, LabelStyles as styles } from "@thewaver/ss-components";

    import { getLabelContext, setLabelContext } from "./Label.context.js";
    import type { LabelProps } from "./Label.types.js";

    let props: LabelProps = $props();

    const context = getLabelContext();
    const labelId = $props.id();
    const isNested = context.getIsLabeled();

    setLabelContext({
        getIsLabeled: () => true,
        getLabelId: () => (isNested ? context.getLabelId() : labelId),
    });

    const orientation = $derived(props.orientation ?? LABEL_DEFAULTS.orientation);
</script>

<svelte:element
    this={isNested ? "div" : "label"}
    id={isNested ? undefined : labelId}
    class={styles.labelRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${props.gap ?? LABEL_DEFAULTS.gap}px`}
>
    {@render props.children?.()}
</svelte:element>
