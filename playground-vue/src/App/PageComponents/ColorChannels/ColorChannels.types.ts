import type { Color } from "@thewaver/ss-utils";

export type PageColorChannelsProps = {
    "hsv": Color.HSVA;
    "onUpdate:hsv"?: (hsv: Color.HSVA) => void;
};
