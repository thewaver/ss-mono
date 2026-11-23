<script lang="ts">
    import { SKIN_SAMPLE_DROP_PROMPT } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";
    import { skinStates } from "@thewaver/ss-playground/App/Skins/Skin.css";
    import { NO_FILES } from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.const";
    import * as dropZoneStyles from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.css";

    import type { SkinStateProps } from "./AppearancePage.types";

    let props: SkinStateProps = $props();
</script>

<div
    class={[
        styles.skinDropZoneSample,
        props.isHovered && skinStates.isHovered,
        props.isReceiving && skinStates.isReceiving,
        props.isDisabled && skinStates.isDisabled,
        props.hasError && skinStates.hasError,
    ]}
>
    <div class={dropZoneStyles.fileDropZonePrompt}>{SKIN_SAMPLE_DROP_PROMPT}</div>
    <div class={[dropZoneStyles.fileDropZoneNames, dropZoneStyles.isEmpty]}>{NO_FILES}</div>
</div>
