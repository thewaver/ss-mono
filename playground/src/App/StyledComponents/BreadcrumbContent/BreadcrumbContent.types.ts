import type { AccessorProps, BreadcrumbsFlags, InteractionFlags } from "@thewaver/ss-components";

export type BreadcrumbContentProps = AccessorProps<{
    flags: InteractionFlags<BreadcrumbsFlags>;
}>;
