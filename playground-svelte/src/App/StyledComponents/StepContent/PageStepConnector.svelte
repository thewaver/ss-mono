<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { StepConnectorProps } from "./StepContent.types";

    let props: StepConnectorProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const columnClass = $derived(props.isRail === true ? styles.columnRailConnector : styles.columnConnector);
</script>

<span class={[props.orientation === "horizontal" ? styles.rowConnector : columnClass, layerClass]}></span>
