<script lang="ts">
    import { Tilter } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.css";
    import knight from "@thewaver/ss-playground/App/knight_profile.webp";

    import type { TilterExampleProps } from "../TilterPageSvelte.types";
    import { KNIGHT_TILTING_POINTER_ALT } from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.const";

    type Props = TilterExampleProps;

    let props: Props = $props();
</script>

<Tilter
    isDisabled={props.isDisabled}
    activeRangePx={props.activeRangePx}
    smoothingMs={props.smoothingMs}
    tiltRangePx={props.tiltRangePx}
    maxTiltDegrees={props.maxTiltDegrees}
    perspectivePx={props.perspectivePx}
>
    <img class={styles.photo} src={knight} alt={KNIGHT_TILTING_POINTER_ALT} />
</Tilter>
