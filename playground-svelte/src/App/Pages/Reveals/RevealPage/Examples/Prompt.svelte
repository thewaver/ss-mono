<script lang="ts">
    import { Reveal } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.css";

    import type { RevealExampleProps } from "../RevealExample.types";

    type Props = RevealExampleProps;

    let props: Props = $props();
</script>

<div class={styles.root}>
    <Reveal
        radius={props.radius}
        softness={props.softness}
        stepSize={props.stepSize}
        joinRadii={props.joinRadii}
        lameExponents={props.lameExponents}
        isDisabled={props.isDisabled}
        ariaLabel={"A cover that knows when it is being looked under"}
        computePoints={props.computePoints}
    >
        {#snippet renderContent()}
            <div class={styles.content}>
                <span class={styles.contentTitle}>The cover knows</span><span
                    >It is handed whether a reveal is happening, so it can say something different.</span
                >
            </div>
        {/snippet}

        {#snippet renderCover(isRevealing, maskStyle)}
            <div class={styles.promptCover} style={maskStyle}>
                {isRevealing ? "found it" : "nothing to see here"}
            </div>
        {/snippet}
    </Reveal>
</div>
