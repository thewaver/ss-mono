<script lang="ts">
    import { Lens } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.css";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

    import type { LensExampleProps } from "../LensPage.types";
    import { MAGNIFYING_LENS_OVER_PICTURE_LABEL } from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.const";

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
        ariaLabel={MAGNIFYING_LENS_OVER_PICTURE_LABEL}
        computePoints={props.computePoints}
    >
        {#snippet renderContent()}
            <img class={styles.photo} src={knight_profile} alt={"A knight in armor"} />
        {/snippet}
    </Lens>
</div>
