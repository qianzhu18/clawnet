export type HapticType = "light" | "medium" | "heavy";

const hapticPatterns: Record<HapticType, number | number[]> = {
  light: 10,
  medium: [12, 10, 14],
  heavy: 32,
};

export function triggerHaptic(type: HapticType = "light") {
  if (typeof window === "undefined") {
    return;
  }

  const vibrate = window.navigator?.vibrate?.bind(window.navigator);

  if (!vibrate) {
    return;
  }

  vibrate(hapticPatterns[type]);
}
