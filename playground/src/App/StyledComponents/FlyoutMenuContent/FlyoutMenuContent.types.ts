import type { FlyoutMenuLinkFlags, FlyoutMenuToggleFlags, InteractionFlags } from "@thewaver/ss-components";

export type BaseFlyoutMenuLinkValues = {
    flags: InteractionFlags<FlyoutMenuLinkFlags>;
};

export type BaseFlyoutMenuLinkProps = BaseFlyoutMenuLinkValues;

export type BaseFlyoutMenuToggleValues = {
    flags: InteractionFlags<FlyoutMenuToggleFlags>;
};

export type BaseFlyoutMenuToggleProps = BaseFlyoutMenuToggleValues;
