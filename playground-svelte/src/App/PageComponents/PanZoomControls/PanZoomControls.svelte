<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";
    import { PAN_ZOOM_ACTIONS } from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.const";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.css";

    import PageControlButtonContent from "../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { PagePanZoomControlsProps } from "./PanZoomControls.types";

    let props: PagePanZoomControlsProps = $props();
</script>

<div class={styles.panZoomControls}>
    {#each PAN_ZOOM_ACTIONS as action (action.key)}
        <Button
            id={`${props.idPrefix}${action.key}`}
            ariaLabel={action.label}
            onClick={() => {
                const controller = props.controller;

                if (!controller) return;

                if (action.kind === "zoom") controller.zoomBy(action.factor);
                else controller.panBy(action.ratio);
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={action.glyph} />
            {/snippet}
        </Button>
    {/each}
</div>
