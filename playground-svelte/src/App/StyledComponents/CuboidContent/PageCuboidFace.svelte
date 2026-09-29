<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CuboidContent/CuboidContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CuboidFaceProps } from "./CuboidContent.types";

    let props: CuboidFaceProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.cuboidFace[props.face], layerClass]}>
    <div class={styles.cuboidFaceTitle}>{props.face}</div>
    <div class={styles.cuboidFaceBody}>{props.state.isShowing ? "facing you" : "turned away"}</div>
</div>
