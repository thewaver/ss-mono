import type { Color } from "@thewaver/ss-utils";

export type PageColorChannelsProps = {
    hsvState: readonly [Color.HSVA, (hsv: Color.HSVA) => void];
};
