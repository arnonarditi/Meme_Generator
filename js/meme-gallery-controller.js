'use-strict'
function onSaveMeme() {
    setImgDataUrl()
    saveMeme()
    onDisplayGallery()
    renderGallery()
}

function displayMemeGallery() {
    document.querySelector('.gallery-layout').classList.add('none')
    document.querySelector('.editor-layout').classList.add('none')
    document.querySelector('.meme-gallery').classList.remove('none')
}

function onRenderSavedMemes() {
    displayMemeGallery()
    onToggleMenu()
    const savedMemes = getSavedMemes()

    const strHtmls = savedMemes.map(meme => {
        return `
        <img src="${meme.imgDataUrl}" class="image-item" 
        onclick="onSavedImageSelect('${meme.selectedImgId}')">
        `
    })
    document.querySelector('.meme-gallery').innerHTML = strHtmls.join('')
}

function onSavedImageSelect(imgId) {
    setGMeme(imgId)
    displayEditor()
    renderMeme()
}