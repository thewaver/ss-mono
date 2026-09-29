import type { Color } from "@thewaver/ss-utils";

export type PageColorChannelsProps = {
    hsv: readonly [Color.HSVA, (hsv: Color.HSVA) => void];
};
