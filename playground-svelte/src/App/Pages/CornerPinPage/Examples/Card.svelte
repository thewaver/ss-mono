<script lang="ts">
    import { Button, CornerPin, QuadWarpUtils } from "@thewaver/ss-components-svelte";
    import { GRIP_LABELS } from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { CornerPinExampleProps } from "../CornerPinPageSvelte.types";

    type Props = CornerPinExampleProps;

    let props: Props = $props();

    let corners = $state(QuadWarpUtils.RESTING_CORNERS);
</script>

<div class={styles.stage}>
    <CornerPin bind:corners reachRatio={props.reachRatio} gripLabels={GRIP_LABELS} ariaLabel={"Card corners"}>
        {#snippet renderGrip(gripProps)}
            <div
                class={[
                    styles.grip,
                    gripProps.isPicked && styles.isPicked,
                    gripProps.isDragging && styles.isDragging,
                    gripProps.focusVisibleAxis !== undefined && styles.isFocused,
                ]}
            ></div>
        {/snippet}

        <div class={styles.card}>
            <div>Pin my corners</div>

            <div>Drag a grip, or tap it and then tap where it should go.</div>
        </div>
    </CornerPin>

    <Button
        id={"cornerPinReset"}
        onClick={() => {
            corners = QuadWarpUtils.RESTING_CORNERS;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Reset</PageButtonContent>
        {/snippet}
    </Button>
</div>
