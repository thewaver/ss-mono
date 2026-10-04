<script lang="ts">
    import { Lens } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.css";
    import knight from "@thewaver/ss-playground/App/knight.webp";

    import type { LensExampleProps } from "../LensPage.types";

    type Props = LensExampleProps;

    let props: Props = $props();
</script>

<div class={styles.root}>
    <Lens
        zoom={props.zoom}
        radius={props.radius}
        softness={props.softness}
        stepSize={props.stepSize}
        joinRadii={props.joinRadii}
        lameExponents={props.lameExponents}
        isDisabled={props.isDisabled}
        ariaLabel={"A magnifying lens over a picture of a knight"}
        computePoints={props.computePoints}
    >
        {#snippet renderContent()}
            <img class={styles.photo} src={knight} alt={"A knight in armor"} />
        {/snippet}
    </Lens>
</div>
