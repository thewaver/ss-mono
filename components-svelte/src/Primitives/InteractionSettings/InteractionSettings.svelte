<script lang="ts">
    import { InteractionSettingsUtils } from "@thewaver/ss-components";

    import { getInteractionSettingsContext, setInteractionSettingsContext } from "./InteractionSettings.context.js";
    import type { InteractionSettingsProps } from "./InteractionSettings.types.js";

    let props: InteractionSettingsProps = $props();

    const parent = getInteractionSettingsContext();

    const settings = $derived(
        InteractionSettingsUtils.merge(parent.getSettings(), { toastHotkeys: props.toastHotkeys }),
    );

    setInteractionSettingsContext({ getSettings: () => settings });
</script>

{@render props.children?.()}
