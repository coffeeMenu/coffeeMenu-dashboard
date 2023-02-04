export const createObjectFromURL = (pics: any, setPictures: Function) => {
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
