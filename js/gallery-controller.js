'use strict'
function renderGallery() {
    const imgs = getImgs()

    var strHtmls = imgs.map(img => `
    <img src="${img.url}" class="image-item" onclick="onImgSelect(${img.id})">
        `)

    const uploadImgs = getUploadedImgs()
    if (uploadImgs.length) {
        var uploadImgsHtmls = uploadImgs.map(img => `
        <img src="${img.url}" class="image-item" onclick="onImgSelect('${img.id}')">
        `)
        strHtmls = uploadImgsHtmls.concat(strHtmls)
    }

    document.querySelector('.gallery-imgs').innerHTML = strHtmls.join('')
}

function onSetKeyWordFilter(val) {
    setKeyWordFilter(val)
    renderGallery()
}
function onImgSelect(id) {
    setImg(id)
}
function onDisplayGallery() {
    document.querySelector('.gallery-layout').classList.remove('none')
    document.querySelector('.meme-gallery').classList.add('none')
    document.querySelector('.editor-layout').classList.add('none')
    document.body.classList.remove('menu-open')
}
function onClickOnKeywordFilter(el, key) {
    onClickedFilterItem(el)
    setKeyWordFilter(key)
    renderGallery()
}
function onClickedFilterItem(item) {
    const style = window.getComputedStyle(item, null).getPropertyValue('font-size');
    const currentSize = parseFloat(style);
    item.style.fontSize = (currentSize + 1) + 'px';
}
//upload image to gallery
function onImgInput(event) {
    createUploadedImg(event,renderGallery)
    onToggleMenu()
}