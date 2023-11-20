/* Note: functions in this module were initially generated using ChatGPT */

export function getRandomColorHex(seed) {
  // Ensure the seed is a string
  seed = String(seed);
  let modifiableSeed = seed;

  // Function to generate a pseudo-random number between 0 and 1
  function pseudoRandom() {
    let hash = 0;
    for (let i = 0; i < modifiableSeed.length; i++) {
      const char = modifiableSeed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    modifiableSeed += 'A' // To prevent infinite loops
    return (hash & 0xfffffff) / 0x10000000; // Map to range [0, 1)
  }

  // Function to generate a random component (0-255) with a minimum contrast ratio against white
  function getRandomComponent(minContrast) {
    let component;
    do {
      component = Math.floor(pseudoRandom() * 256);
    } while (getContrastRatio(component, 255) < minContrast);
    return component;
  }

  // Function to calculate the contrast ratio between two values
  function getContrastRatio(value1, value2) {
    const l1 = value1 / 255;
    const l2 = value2 / 255;

    const lum1 = l1 <= 0.03928 ? l1 / 12.92 : Math.pow((l1 + 0.055) / 1.055, 2.4);
    const lum2 = l2 <= 0.03928 ? l2 / 12.92 : Math.pow((l2 + 0.055) / 1.055, 2.4);

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  }

  // Generate random RGB components with a minimum contrast ratio of 2.5 against white
  const red = getRandomComponent(2.5);
  const green = getRandomComponent(2.5);
  const blue = getRandomComponent(2.5);

  // Convert RGB components to hex and return the color
  const color = `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
  return color;
}

export function hexToTenPercentOpacity(hexColor) {
  // Ensure the input is a valid hex color
  const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
  if (!hexRegex.test(hexColor)) {
    throw new Error(`Invalid hex color format: ${hexColor}`);
  }

  // Extract RGB components from hex
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Convert to rgba format with 10% opacity
  const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.1)`;

  return rgbaColor;
}
