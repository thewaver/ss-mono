<script lang="ts">
    import { Button, getToastsContext } from "@thewaver/ss-components-svelte";
    import { FAR_DOWN_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import type { ToastsSaveButtonProps } from "../ToastsPageSvelte.types";

    const DURATION_MS = 4000;

    let props: ToastsSaveButtonProps = $props();

    const toasts = getToastsContext<ToastDefs>();
</script>

<Button
    id={props.id}
    onClick={() => {
        props.onAnswer({
            id: toasts.show({
                value: { kind: "success", message: FAR_DOWN_MESSAGE },
                announcement: FAR_DOWN_MESSAGE,
                durationMs: DURATION_MS,
            }),
        });
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>{props.caption}</PageButtonContent>
    {/snippet}
</Button>
