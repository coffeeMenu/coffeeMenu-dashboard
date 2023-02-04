export const compactTitle = (title: string) => {
  if (title.length >= 20) {
    const end = title[20] === ' ' ? 20 : 19;
    return title.substring(0, end) + '...';
  }
  return title;
};

export const findCategoryObject = (CategoryId: string, categories: any) => {
  return categories.filter((cat: any) => {
    return cat.id === CategoryId;
  })[0];
};

export const urlToObject = async (imageUrl: string, fileName: string) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};
