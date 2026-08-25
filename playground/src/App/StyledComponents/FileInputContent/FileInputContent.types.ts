import type { AccessorProps, FileInputFlags, InteractionFlags } from "@thewaver/ss-components";

export type FileInputContentProps = AccessorProps<{
    flags: InteractionFlags<FileInputFlags>;
}>;
