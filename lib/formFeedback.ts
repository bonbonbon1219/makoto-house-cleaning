export function invalidFieldMessage(form: HTMLFormElement) {
  const field = form.querySelector(":invalid") as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  if (!field) return "未入力の項目があります。";

  const label = field
    .closest("label")
    ?.querySelector("span")
    ?.textContent?.replace(/\s+/g, " ")
    .trim();
  const name = label || "必須項目";

  if (field instanceof HTMLInputElement && field.validity.typeMismatch) {
    return `「${name}」の形式を確認してください。`;
  }

  return `「${name}」を入力してください。`;
}

export function focusFirstInvalid(form: HTMLFormElement) {
  const field = form.querySelector(":invalid") as HTMLElement | null;
  if (!field) return;
  field.scrollIntoView({ behavior: "smooth", block: "center" });
  field.focus({ preventScroll: true });
}
