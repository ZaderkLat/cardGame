
export function generateGuestId() {
  const numbers = new Set<number>();

  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 10));
  }

  return "Guest-" + Array.from(numbers).join("");
}