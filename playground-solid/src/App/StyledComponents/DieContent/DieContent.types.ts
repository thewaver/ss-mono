import type { AccessorProps, DieFaceState } from "@thewaver/ss-components-solid";

export type PageDieFaceProps = AccessorProps<{
    state: DieFaceState;
    label: string;
}>;

export type PageDieIconProps = AccessorProps<{
    state: DieFaceState;
    icon: string;
}>;
