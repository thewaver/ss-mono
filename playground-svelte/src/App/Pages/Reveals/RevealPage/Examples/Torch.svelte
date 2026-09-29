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
        ariaLabel={"A torch over a hidden note"}
        computePoints={props.computePoints}
    >
        {#snippet renderContent()}
            <div class={styles.content}>
                <span class={styles.contentTitle}>Under the cover</span><span
                    >The cover is whatever you pass; the component only cuts the hole in it.</span
                ><span
                    >The hole is a mask, so the cover keeps its own paint everywhere else.</span
                >
            </div>
        {/snippet}

        {#snippet renderCover(_, maskStyle)}
            <div class={styles.solidCover} style={maskStyle}>Move the pointer over me</div>
        {/snippet}
    </Reveal>
</div>
