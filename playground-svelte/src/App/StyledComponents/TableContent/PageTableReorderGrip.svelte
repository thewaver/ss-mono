<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.tableReorderGrip, layerClass]}>{"⠿"}</div>
