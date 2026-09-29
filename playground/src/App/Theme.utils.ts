export const toBackdropGradient = (light: string, dark: string) =>
    `radial-gradient(ellipse at top, hsl(from ${light} h s 50% / 10%), transparent 33%), radial-gradient(ellipse at top, hsl(from ${light} h s 50% / 10%), transparent 66%), radial-gradient(ellipse at top, ${light}, ${dark})`;
