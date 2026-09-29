<script lang="ts">
    import { Button, ScratchCard } from "@thewaver/ss-components-svelte";
    import type { ScratchCardController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";

    import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ScratchCardWindowsExampleProps } from "../ScratchCardPage.types";

    const TICKET_WIDTH = 360;
    const SYMBOLS = ["★", "♦", "★"];
    const FIRST_WINDOW = 1;

    type Props = ScratchCardWindowsExampleProps;

    let props: Props = $props();

    const controllers: ScratchCardController[] = [];
</script>

<div class={styles.stack}>
    <PageMeasureBox width={TICKET_WIDTH}>
        <div class={styles.windows}>
            {#each SYMBOLS as symbol, index (index)}
                <div class={styles.card}>
                    <ScratchCard
                        brushRadius={props.brushRadius}
                        precision={props.precision}
                        softness={props.softness}
                        computePoints={props.computePoints}
                        clearThreshold={props.clearThreshold}
                        ariaLabel={`Scratch window ${index + FIRST_WINDOW}`}
                        onMount={(controller) => {
                            controllers[index] = controller;
                        }}
                        onScratch={(ratio) => props.onWindowScratch(index, ratio)}
                        onClear={() => props.onWindowClear(index)}
                    >
                        {#snippet renderContent()}
                            <div class={styles.windowPrize}>{symbol}</div>
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
            {/each}
        </div>
    </PageMeasureBox>

    <div class={styles.buttonRow}>
        <Button
            id={"newWindowsTicket"}
            onClick={() => {
                controllers.forEach((controller) => controller.reset());
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>New ticket</PageButtonContent>
            {/snippet}
        </Button>
    </div>
</div>
