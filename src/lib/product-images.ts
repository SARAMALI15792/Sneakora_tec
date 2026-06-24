const GRADIENT_PALETTES = [
  ["#667eea", "#764ba2"],
  ["#f093fb", "#f5576c"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#a18cd1", "#fbc2eb"],
  ["#fccb90", "#d57eeb"],
  ["#e0c3fc", "#8ec5fc"],
  ["#f5576c", "#ff9a9e"],
  ["#5ee7df", "#b490ca"],
  ["#c471f5", "#fa71cd"],
  ["#f9d976", "#f39f86"],
];

export function getGradientColors(index: number): [string, string] {
  const palette = GRADIENT_PALETTES[index % GRADIENT_PALETTES.length];
  return [palette[0], palette[1]];
}

export function generatePlaceholderUrl(name: string, index: number = 0): string {
  const [color1, color2] = getGradientColors(index);
  const encodedName = encodeURIComponent(name || "Sneaker");
  return `https://placehold.co/600x600/${color1.replace("#", "")}/${color2.replace("#", "")}?text=${encodedName}&font=montserrat`;
}

export function getProductImage(images: string[], name: string, index: number = 0): string {
  if (images && images.length > 0) {
    return images[0];
  }
  return generatePlaceholderUrl(name, index);
}

export function getAllProductImages(images: string[], name: string, count: number = 2): string[] {
  if (images && images.length > 0) {
    return images;
  }
  return Array.from({ length: count }, (_, i) => generatePlaceholderUrl(name, i));
}