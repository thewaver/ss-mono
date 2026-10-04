<script lang="ts">
    import { Accordion } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import { getLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
    import type { AccordionExampleProps } from "../../Accordions.types";

    const GAP = 5;

    const PANEL_BODIES: Record<string, string> = {
        Mountains: "Opens to half the row, header strip included.",
        Coast: "Opens to a third of the row.",
        Forest: "Carries no width of its own, so it fills whatever the closed strips leave.",
        Desert: "Opens to a fifth of the row, narrow enough that the text wraps tightly.",
    };

    const ITEMS: AccordionItem<string>[] = [
        { value: "Mountains", openWidthShare: 0.5 },
        { value: "Coast", openWidthShare: 1 / 3 },
        { value: "Forest" },
        { value: "Desert", openWidthShare: 0.2 },
    ];

    type Props = AccordionExampleProps;

    let { expanded = $bindable([]) }: Props = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<Accordion
    items={ITEMS}
    bind:expanded
    orientation={"horizontal"}
    sizing={"fill"}
    isSingleExpand={true}
    isExpandRequired={true}
    gap={GAP}
>
    {#snippet renderHeader(item, flags)}
        <div class={[styles.rowStrip, layerClass, flags.isHovered && styles.rowStripHovered]}>
            <span class={styles.rowStripLabel}>{item.value}</span>
        </div>
    {/snippet}

    {#snippet renderPanel(item, visibilityTarget, transitionDurationMs, moveDirection)}
        <div
            class={[
                styles.rowFittedPanel,
                visibilityTarget === 1 && moveDirection === "forward" && styles.rowPanelEnterForward,
                visibilityTarget === 1 && moveDirection === "backward" && styles.rowPanelEnterBackward,
            ]}
            style:opacity={visibilityTarget}
            style:transition={`opacity ${transitionDurationMs}ms`}
            style:animation-duration={`${transitionDurationMs}ms`}
        >
            <strong>{item.value}</strong>

            <div>{PANEL_BODIES[item.value]}</div>
        </div>
    {/snippet}
</Accordion>
