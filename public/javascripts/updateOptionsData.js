export const updateOptionsData = function () {
  const getAllSelect = document.querySelectorAll("select");
  getAllSelect.forEach((elm) => {
    const selectElm = document.getElementById(elm.id);
    const selectParentElm = selectElm.parentNode;
    const newSelectElm = selectElm.cloneNode(false);
    selectParentElm.replaceChild(newSelectElm, selectElm);
    return newSelectElm;
  });
};
