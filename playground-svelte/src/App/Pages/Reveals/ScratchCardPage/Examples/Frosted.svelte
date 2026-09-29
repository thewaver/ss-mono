<script lang="ts">
    import { Button, ScratchCard } from "@thewaver/ss-components-svelte";
    import type { ScratchCardController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";

    import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

    const CARD_WIDTH = 360;

    type Props = ScratchCardExampleProps;

    let props: Props = $props();

    let controller = $state.raw<ScratchCardController>();
</script>

<div class={styles.stack}>
    <PageMeasureBox width={CARD_WIDTH}>
        <div class={styles.card}>
            <ScratchCard
                brushRadius={props.brushRadius}
                precision={props.precision}
                softness={props.softness}
                computePoints={props.computePoints}
                clearThreshold={props.clearThreshold}
                ariaLabel={"Rub the frost away"}
                onMount={(next) => {
                    controller = next;
                }}
                onScratch={props.onScratch}
                onClear={props.onClear}
            >
                {#snippet renderContent()}
                    <div class={styles.pane}>
                        <span class={styles.paneTitle}>Frosted, not opaque</span><span
                            >A cover that blurs rather than hides means the rub sharpens what is under it.</span
                        >
                    </div>
                {/snippet}

                {#snippet renderCover(maskStyle)}
                    <div class={styles.frost} style={maskStyle}></div>
                {/snippet}
            </ScratchCard>
        </div>
    </PageMeasureBox>

    <div class={styles.buttonRow}>
        <Button
            id={"newFrost"}
            onClick={() => {
                controller?.reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Re-freeze</PageButtonContent>
            {/snippet}
        </Button>
    </div>
</div>
