export function extractAfterH(text) {
  if (text.includes("h ")) {
    return text.split("h ")[1].trim();
  } else {
    return text; // return input as it is
  }
}
