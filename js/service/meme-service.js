'use strict'
const S_KEY_SAVED_MEME = 'MemesDB'
const S_KEY_UPLOADED_IMGS = 'UploadedImgsDB'
//global vars
var gKeywordSearchCountMap = { 'funny': 13, 'animal': 4, 'baby': 7, 'crazy': 7 }
var gFilterKeyword = ''
var gSavedMemes = []
var gUploadedImgs = loadFromStorage(S_KEY_UPLOADED_IMGS) || []
var gMeme

var gImgs = [{ id: 1, url: 'imgs/meme-imgs-sq/1.jpg', keywords: ['funny', 'crazy'] },//Trump
{ id: 2, url: 'imgs/meme-imgs-sq/2.jpg', keywords: ['baby', 'animal'] },
{ id: 3, url: 'imgs/meme-imgs-sq/3.jpg', keywords: ['funny', 'animal'] },
{ id: 4, url: 'imgs/meme-imgs-sq/4.jpg', keywords: ['animal', 'baby'] },
{ id: 5, url: 'imgs/meme-imgs-sq/5.jpg', keywords: ['baby', 'funny'] },
{ id: 6, url: 'imgs/meme-imgs-sq/6.jpg', keywords: ['crazy', 'funny'] },
{ id: 7, url: 'imgs/meme-imgs-sq/7.jpg', keywords: ['crzy', 'baby', 'funny'] },
{ id: 8, url: 'imgs/meme-imgs-sq/8.jpg', keywords: ['funny'] },
{ id: 9, url: 'imgs/meme-imgs-sq/9.jpg', keywords: ['funny', 'baby'] },
{ id: 10, url: 'imgs/meme-imgs-sq/10.jpg', keywords: ['funny', 'crazy'] },
{ id: 11, url: 'imgs/meme-imgs-sq/11.jpg', keywords: ['crazy', 'animal'] },
{ id: 12, url: 'imgs/meme-imgs-sq/12.jpg', keywords: ['funny'] },
{ id: 13, url: 'imgs/meme-imgs-sq/13.jpg', keywords: ['funny', 'crazy'] },
{ id: 14, url: 'imgs/meme-imgs-sq/14.jpg', keywords: ['crazy'] },
{ id: 15, url: 'imgs/meme-imgs-sq/15.jpg', keywords: ['funny'] },
{ id: 16, url: 'imgs/meme-imgs-sq/16.jpg', keywords: ['funny'] },
{ id: 17, url: 'imgs/meme-imgs-sq/17.jpg', keywords: ['crazy', 'baby'] },
{ id: 18, url: 'imgs/meme-imgs-sq/18.jpg', keywords: ['funny', 'baby'] },
]

function _createMeme(id) {
    return {
        selectedImgId: id,
        selectedLineIdx: 0,
        imgDataUrl: '',
        lines: [
            {
                txt: 'ENTER TEXT HERE', size: 30, align: 'center',
                color: 'white', offsetX: gElCanvas.clientWidth / 2, offsetY: 50,
                font: 'impact', isDrag: false
            }]
    }
}

function setVerticalCoords(line, lineIdx) {
    //first line
    if (!lineIdx) return
    const textHeight = getFullTextHeight(line.txt)

    if (lineIdx === 1 && !line.isDrag) line.offsetY = gElCanvas.clientHeight - 50 - textHeight
    else if (!line.isDrag) line.offsetY = gElCanvas.clientHeight / 2 - (textHeight / 2)
}

function SetHorizontalCoords(line, lineIdx) {
    if (lineIdx !== gMeme.selectedLineIdx) return
    if (line.align === 'left' && !line.isDrag) line.offsetX = 30

    else if (line.align === 'right' && !line.isDrag) line.offsetX = gElCanvas.clientWidth - 30
    else if (!line.isDrag) line.offsetX = gElCanvas.clientWidth / 2
}

function getFullTextHeight(text) {
    const textSizes = gCtx.measureText(text)
    return textSizes.fontBoundingBoxAscent + textSizes.fontBoundingBoxDescent
}
function getTextWidth(text) {
    return gCtx.measureText(text).width
}
function getKeyword() {
    return gFilterKeyword
}
function getMeme() {
    return gMeme
}
function getMemeLines() {
    return gMeme.lines
}
function getSelectedLine() {
    return gMeme.selectedLineIdx
}

function getImgUrlById(id) {
    if (typeof id === 'string') return gUploadedImgs.find(img => img.id === id).url
    return gImgs.find(img => img.id === id).url
}
function getImgById(id) {
    return gImgs.find(img => img.id === id)
}
function setLineTxt(value) {
    gMeme.lines[gMeme.selectedLineIdx].txt = value
}
function setKeyWordFilter(val) {
    gFilterKeyword = val
}
function setImg(id) {
    gMeme = _createMeme(id)
    onDisplayMeme()
}
function setFont(val) {
    gMeme.lines[gMeme.selectedLineIdx].font = val
}
function setTextColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}
function setFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function createUploadedImg(ev, cb) {
    const reader = new FileReader()

    reader.onload = function (event) {
        gUploadedImgs.unshift({ id: makeId(4), url: event.target.result })
        saveToStorage(S_KEY_UPLOADED_IMGS, gUploadedImgs)
        cb()
    }
    reader.readAsDataURL(ev.target.files[0])
}

function AddLineToMeme(initValue) {
    gMeme.lines.push(createLine(initValue))
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function createLine(txt) {
    return {
        txt: txt, size: 30, align: 'center',
        color: 'white', offsetX: gElCanvas.clientWidth / 2, offsetY: 50, font: 'impact', isDrag: false
    }
}
function DeleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx === gMeme.lines.length && gMeme.lines.length) gMeme.selectedLineIdx--
}

function SwitchLines() {
    var lines = gMeme.lines
    if (lines.length - 1 === gMeme.selectedLineIdx) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++

    return lines[gMeme.selectedLineIdx].txt
}
function changeAlign(alignTo) {
    gMeme.lines[gMeme.selectedLineIdx].align = alignTo
}
//Share on facebook
function shareMeme(elLink) {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')
    getHttpUrl(imgDataUrl, elLink, onSuccess)
}

function onSuccess(imgUrl, elLink) {
    const encodedUploadedImgUrl = encodeURIComponent(imgUrl)
    const hRef = `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`
    elLink.href = hRef
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${imgUrl}&t=${imgUrl}`)
    return false
}

function getHttpUrl(imgDataUrl, elLink, cb) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Not found')
        const { responseText: url } = XHR
        cb(url,elLink)
    }

    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

// saved-meme section
function setImgDataUrl() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')
    gMeme.imgDataUrl = imgDataUrl
}
function saveMeme() {
    gSavedMemes.unshift(gMeme)
    saveToStorage(S_KEY_SAVED_MEME, gSavedMemes)
}
function loadMemesFromStorage() {
    if (loadFromStorage(S_KEY_SAVED_MEME)) gSavedMemes = loadFromStorage(S_KEY_SAVED_MEME)
}
function loadUploadedImagesFromStorage() {
    if (loadFromStorage(S_KEY_UPLOADED_IMGS)) gUploadedImgs = loadFromStorage(S_KEY_UPLOADED_IMGS)

}
function getSavedMemes() {
    return gSavedMemes
}
function setGMeme(imgId) {
    const currMeme = gSavedMemes.find(meme => meme.selectedImgId === +imgId)
    gMeme = currMeme
}

//drag and drop
function selectedLineIsClicked(evPos) {
    const {offsetY: lineY, align, isDrag, txt } = gMeme.lines[gMeme.selectedLineIdx]
    const textWidth = getTextWidth(txt)
    const textHeight = getFullTextHeight(txt)
    //complex conditions
    if (!isDrag) {
        if (align === 'left') {
            if (evPos.x < 20 || evPos.x > textWidth + 20 ||
                evPos.y < lineY - 15 || evPos.y > lineY + textHeight) return false
        } else if (align === 'right') {
            if (evPos.x < gElCanvas.clientWidth - textWidth - 40 || evPos.x > gElCanvas.clientWidth - 30 ||
                evPos.y < lineY - 15 || evPos.y > lineY + textHeight) return false
        } else if (evPos.x < gElCanvas.clientWidth / 2 - textWidth / 2 - 20 || evPos.x > gElCanvas.clientWidth / 2 + textWidth / 2 + 20 ||
            evPos.y < lineY - 15 || evPos.y > lineY + textHeight) return false
    }
    //if already dragged
    else {
        const line = gMeme.lines[gMeme.selectedLineIdx]
        if (evPos.x < line.offsetX - 10 ||
            evPos.x > gElCanvas.clientWidth - line.offsetX + textWidth + 20 ||
            evPos.y < lineY - 15 || evPos.y > lineY + textHeight) return false
    }
    return true
}

function setLineDrag(dragProperty) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = dragProperty
}

function moveMeme(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].offsetX += dx
    gMeme.lines[gMeme.selectedLineIdx].offsetY += dy
}

