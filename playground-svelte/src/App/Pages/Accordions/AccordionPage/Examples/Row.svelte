<script lang="ts">
    import { Accordion } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import { getLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
    import type { AccordionExampleProps } from "../../Accordions.types";

    const GAP = 5;

    const PANEL_BODIES: Record<string, string> = {
        Mountains: "Cold air, long views and a path that only goes up.",
        Coast: "Salt, wind and a horizon that never quite arrives.",
        Forest: "Green light, soft ground and no straight lines anywhere.",
        Desert: "Heat by day, stars by night, and silence in between.",
    };

    const ITEMS: AccordionItem<string>[] = [
        { value: "Mountains" },
        { value: "Coast" },
        { value: "Forest" },
        { value: "Desert" },
    ];

    type Props = AccordionExampleProps;

    let { expanded = $bindable([]) }: Props = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<Accordion
    items={ITEMS}
    bind:expanded
    orientation={"horizontal"}
    sizing={"fit-content"}
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
                styles.rowPanel,
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
