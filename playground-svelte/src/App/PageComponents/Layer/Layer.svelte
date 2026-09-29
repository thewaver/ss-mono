<script lang="ts">
    import PageLayerScope from "../../StyledComponents/Layer/Layer.svelte";
    import { setLayerContext } from "./Layer.context";
    import type { PageLayerProps } from "./Layer.types";

    let props: PageLayerProps = $props();

    setLayerContext({
        get level() {
            return props.level;
        },
    });
</script>

<PageLayerScope>
    {@render props.children?.()}
</PageLayerScope>
