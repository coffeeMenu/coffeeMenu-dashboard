export const compactTitle = (title: string) => {
  if (title.length >= 20) {
    const end = title[20] === ' ' ? 20 : 19;
    return title.substring(0, end) + '...';
  }
  return title;
};
