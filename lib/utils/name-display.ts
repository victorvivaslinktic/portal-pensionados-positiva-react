export function normalizeNameForDisplay(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  return name
    .trim()
    .replace(/PÃ©rez/g, "Pérez")
    .replace(/PÃ©/g, "Pé")
    .replace(/Ã©/g, "é")
    .replace(/Ã¡/g, "á")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã/g, "Á")
    .replace(/Ã‰/g, "É")
    .replace(/Ã/g, "Í")
    .replace(/Ã"/g, "Ó")
    .replace(/Ãš/g, "Ú")
    .replace(/Ã'/g, "Ñ")
    .trim();
}
