import Compressor from 'compressorjs';

export const compressImage = (file: File): Promise<File | Blob | undefined> => {
  return new Promise<File | Blob | undefined>((resolve, reject) => {
    if (!file) {
      reject();
    }

    new Compressor(file, {
      strict: true,
      checkOrientation: true,
      minWidth: 0,
      maxWidth: 0,
      width: 1500,
      height: 1500,
      resize: 'cover',
      quality: 0.8,
      mimeType: 'auto',
      // TODO test a transparent png
      convertTypes: 'image/png',
      convertSize: 1000000,
      success(result) {
        resolve(result);
        console.log(result);

        console.log('res');
      },
      error(err) {
        console.error(err.message);
      },
    });
  });
};
