export const formDataToObject = (formData: FormData) => {
  const object: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  return object;
};
