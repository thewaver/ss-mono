<script lang="ts">
    import { RGBSplitter } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.css";
    import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";

    import type { RGBSplitterExampleProps } from "../RGBSplitterPageSvelte.types";

    type Props = RGBSplitterExampleProps;

    let props: Props = $props();
</script>

<div class={styles.stage}>
    <RGBSplitter
        isDisabled={props.isDisabled}
        activeRangePx={props.activeRangePx}
        smoothingMs={props.smoothingMs}
        splitRangePx={props.splitRangePx}
        maxOffsetPx={props.maxOffsetPx}
        colorMixing={props.colorMixing}
    >
        <img class={styles.photo} src={knightProfile} alt={"A knight in armor"} />
    </RGBSplitter>
</div>
