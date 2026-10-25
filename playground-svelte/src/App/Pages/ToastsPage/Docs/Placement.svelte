<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Toasts } from "@thewaver/ss-components-svelte";

    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import type { ToastsPlacementDocsExampleProps } from "../ToastsPageSvelte.types";
    import PlacementRaisers from "./PlacementRaisers.svelte";

    type Props = ToastsPlacementDocsExampleProps;

    let props: Props = $props();
</script>

<Toasts
    ariaLabel={"Placement notifications"}
    alignment={props.alignment}
    flexDirection={props.flexDirection}
    gap={props.gap}
    margins={{
        marginTop: props.margin,
        marginRight: props.margin,
        marginBottom: props.margin,
        marginLeft: props.margin,
    }}
>
    <PlacementRaisers />

    {#snippet renderToast(
        toast: Toast<ToastDefs>,
        visibilityTarget: 0 | 1,
        transitionDurationMs: number,
        state: ToastState,
        dismiss: () => boolean,
    )}
        <PageToastContent
            {toast}
            {state}
            stacking={props.stacking}
            flexDirection={props.flexDirection}
            gap={props.gap}
            {visibilityTarget}
            {transitionDurationMs}
            onDismiss={dismiss}
        />
    {/snippet}
</Toasts>
