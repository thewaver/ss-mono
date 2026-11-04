<script lang="ts">
    import { Accordion, AccordionUtils } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";
    import {
        headerJoins,
        panelJoins,
    } from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

    import { getLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
    import type { AccordionOrientationDocsExampleProps } from "../AccordionPageSvelte.types";

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

    type Props = AccordionOrientationDocsExampleProps;

    let props: Props = $props();

    let expanded = $state<string[]>(["Mountains"]);

    const panelSide = $derived(AccordionUtils.getPanelSide(props.orientation));

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={styles.orientationExample} data-orientation={props.orientation}>
    <Accordion
        items={ITEMS}
        gap={DOCS_GAP}
        bind:expanded
        orientation={props.orientation}
        sizing={props.orientation === "horizontal" ? "fit-content" : undefined}
        isSingleExpand={true}
        isExpandRequired={true}
    >
        {#snippet renderHeader(item, flags)}
            <div
                class={[
                    styles.orientationStrip,
                    layerClass,
                    flags.isExpanded && styles.isExpanded,
                    flags.isHovered && styles.isHovered,
                    flags.isExpanded && headerJoins[panelSide],
                ]}
            >
                <span class={styles.orientationLabel}>{item.value}</span>
            </div>
        {/snippet}

        {#snippet renderPanel(item, visibilityTarget, transitionDurationMs, moveDirection)}
            <div
                class={[
                    styles.orientationPanel,
                    layerClass,
                    visibilityTarget === 1 && styles.isEntering,
                    visibilityTarget === 1 && panelJoins[panelSide],
                ]}
                data-move={moveDirection}
                style:opacity={visibilityTarget}
                style:transition={`opacity ${transitionDurationMs}ms`}
                style:animation-duration={`${transitionDurationMs}ms`}
            >
                <div>{PANEL_BODIES[item.value]}</div>
            </div>
        {/snippet}
    </Accordion>
</div>
