export function parseCurrency(value: string | number | undefined | null): number {
  if (value == null || value === "") return 0;

  if (typeof value === "number") return value;

  const normalizado = value.replace(/\./g, "").replace(",", ".");

  const numero = Number(normalizado);

  return isNaN(numero) ? 0 : numero;
}
