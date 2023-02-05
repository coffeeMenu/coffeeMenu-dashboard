// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
export const createUrlFromObject = (pics: Blob[] | MediaSource[], setPictures: Function) => {
    if (!pics) {
        setPictures(undefined);
        return;
    }

    let tmp = [];
    for (let i = 0; i < pics.length; i++) {
        tmp.push(URL.createObjectURL(pics[i]));
    }
    const objectUrls = tmp;
    setPictures(objectUrls);

    // TODO check if it frees memory or not
    for (let i = 0; i < objectUrls.length; i++) {
        return () => {
            URL.revokeObjectURL(objectUrls[i]);
        };
    }
};

// for more info see: https://stackoverflow.com/questions/42471755/convert-image-into-blob-using-javascript
export const createObjectFromUrl = async (pic: string) => {
    return await fetch(pic)
        .then(function (response) {
            return response.blob();
        })
        .then(function (blob) {
            return blob;
            // need to modify
        });
};
