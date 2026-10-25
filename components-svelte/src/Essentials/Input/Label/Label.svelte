<script lang="ts">
    import { LABEL_DEFAULTS, LabelStyles as styles } from "@thewaver/ss-components";

    import { getLabelContext, setLabelContext } from "./Label.context.js";
    import type { LabelProps } from "./Label.types.js";

    let props: LabelProps = $props();

    const context = getLabelContext();
    const labelId = $props.id();
    const isNested = context.getIsLabeled();

    let registeredControlId = $state<string>();
    let registeredCaptionId = $state<string>();

    setLabelContext({
        getIsLabeled: () => true,
        getLabelId: () => (isNested ? context.getLabelId() : labelId),
        setControlId: (id) => {
            if (isNested) {
                context.setControlId(id);

                return;
            }

            registeredControlId = id;
        },
        getCaptionId: () => (isNested ? context.getCaptionId() : registeredCaptionId),
        setCaptionId: (id) => {
            if (isNested) {
                context.setCaptionId(id);

                return;
            }

            registeredCaptionId = id;
        },
    });

    const orientation = $derived(props.orientation ?? LABEL_DEFAULTS.orientation);
</script>

<svelte:element
    this={isNested ? "div" : "label"}
    id={isNested ? undefined : labelId}
    for={isNested ? undefined : (props.for ?? registeredControlId)}
    class={styles.labelRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${props.gap ?? LABEL_DEFAULTS.gap}px`}
>
    {@render props.children?.()}
</svelte:element>
