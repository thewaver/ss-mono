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
        ariaLabel={"A frosted cover over a note"}
        computePoints={props.computePoints}
    >
        {#snippet renderContent()}
            <div class={styles.content}>
                <span class={styles.contentTitle}>Frosted, not opaque</span><span
                    >A cover that blurs rather than hides means the hole sharpens instead of uncovering.</span
                ><span
                    >Same component, different cover.</span
                >
            </div>
        {/snippet}

        {#snippet renderCover(_, maskStyle)}
            <div class={styles.frostedCover} style={maskStyle}></div>
        {/snippet}
    </Reveal>
</div>
