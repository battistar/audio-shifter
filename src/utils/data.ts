export const fileToData = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (): void => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};
