export default function sanitize(value: string): string {
  return value.trim() //Trims Values
    .replace(/^"(.*)"$/, '$1') //Replaces text qualifying quotes
    .replace(/\'\'/g, '"') // Replaces double single quotes
    .replace(/\'/g, '\'\''); //Escapes single quotes for SQL
}
