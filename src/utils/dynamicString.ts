export const dynamicString = (
  template: string,
  values?: Record<string, string | number>
): string => {
  if (!values) return template;

  return template.replace(/{{(.*?)}}/g, (_, key) =>
    key.trim() in values ? String(values[key.trim()]) : `{{${key}}}`
  );
};
