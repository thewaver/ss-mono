<script lang="ts">
    import { LayerUtils } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.utils";

    import PageLayerScope from "../../StyledComponents/Layer/Layer.svelte";
    import { getLayerContext, setLayerContext } from "./Layer.context";
    import type { PageLayerProps } from "./Layer.types";

    let props: PageLayerProps = $props();

    const parent = getLayerContext();

    setLayerContext({
        get level() {
            return props.level ?? LayerUtils.computeNextLevel(parent?.level);
        },
    });
</script>

<PageLayerScope>
    {@render props.children?.()}
</PageLayerScope>
