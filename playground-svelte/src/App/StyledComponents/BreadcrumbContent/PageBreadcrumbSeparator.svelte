<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/BreadcrumbContent/BreadcrumbContent.css";

    import { getLayerClass } from "../Layer/Layer.context";

    const layerClass = $derived.by(getLayerClass());
</script>

<span class={[styles.breadcrumbSeparator, layerClass]}>/</span>
