export default function classNames(styles, ...values) {
  return values
    .flatMap((value) => (typeof value === "string" ? value.split(/\s+/) : []))
    .filter(Boolean)
    .map((className) => styles[className] ?? className)
    .join(" ");
}
