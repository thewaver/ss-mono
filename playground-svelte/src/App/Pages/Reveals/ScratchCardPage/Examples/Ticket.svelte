<script lang="ts">
    import { Button, ScratchCard } from "@thewaver/ss-components-svelte";
    import type { ScratchCardController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

    const CARD_WIDTH = 360;
    const PRIZE = "★ 10 000 ★";

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
                ariaLabel={"Scratch to reveal the prize"}
                onMount={(next) => {
                    controller = next;
                }}
                onScratch={props.onScratch}
                onClear={props.onClear}
            >
                {#snippet renderContent()}
                    <div class={styles.prize}>{PRIZE}</div>
                {/snippet}

                {#snippet renderCover(maskStyle)}
                    <div class={styles.foil} style={maskStyle}></div>
                {/snippet}

                {#snippet renderBrush(isRubbing, geometry)}
                    <div
                        class={[styles.coin, isRubbing && styles.coinRubbing]}
                        style:clip-path={geometry.clipPath}
                    ></div>
                {/snippet}
            </ScratchCard>
        </div>
    </PageMeasureBox>

    <div class={styles.buttonRow}>
        <Button
            id={"newTicket"}
            ariaLabel={"New ticket"}
            onClick={() => {
                controller?.reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
            {/snippet}
        </Button>
    </div>
</div>
