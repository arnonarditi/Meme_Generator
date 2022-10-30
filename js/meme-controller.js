'use strict'
var gCtx
var gElCanvas
let gPrevPos
let gDragInterval = false

function onDisplayMeme() {
    displayEditor()
    renderMeme()
}
function displayEditor() {
    document.querySelector('.gallery-layout').classList.add('none')
    document.querySelector('.meme-gallery').classList.add('none')
    document.querySelector('.editor-layout').classList.remove('none')
}

function initCanvas() {
    gElCanvas = document.getElementById('meme-canvas')
    gCtx = gElCanvas.getContext('2d')
}

function renderMeme() {
    const meme = getMeme()
    var img = new Image()
    img.src = getImgUrlById(meme.selectedImgId)

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.clientWidth, gElCanvas.clientHeight)
        renderLines()
    }
}

//draw the lines by order
function renderLines() {
    var lines = getMemeLines()

    lines.forEach((line, lineIdx) => {
        gCtx.beginPath()

        gCtx.fillStyle = line.color
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.textAlign = `${line.align}`
        gCtx.textBaseline = 'top'
        
        SetHorizontalCoords(line, lineIdx)
        setVerticalCoords(line, lineIdx)
        drawStrokeRect(line, lineIdx)

        gCtx.strokeStyle = 'black'
        gCtx.lineWidth = 5
        gCtx.strokeText(line.txt, line.offsetX, line.offsetY)
        gCtx.fillText(line.txt, line.offsetX, line.offsetY)
    })
}

function drawStrokeRect(line, lineIdx) {
    gCtx.lineWidth = 1
    if (lineIdx !== getSelectedLine()) return

    const textHeight = getFullTextHeight(line.txt)
    const textWidth = getTextWidth(line.txt)
    gCtx.strokeStyle = 'yellow'

    if (!line.isDrag) {
        if (line.align === 'left') {
            gCtx.strokeRect(20, line.offsetY - 15, textWidth + 20, textHeight + 20)
        } else if (line.align === 'right') {
            gCtx.strokeRect(gElCanvas.clientWidth - textWidth - 40, line.offsetY - 15, textWidth + 20, textHeight + 20)
        }
        else gCtx.strokeRect(line.offsetX - (textWidth / 2) - 10, line.offsetY - 15, textWidth + 20, textHeight + 20)
    }
    else {
        line.align = 'left'
        gCtx.strokeRect(line.offsetX - 10, line.offsetY - 15, textWidth + 20, textHeight + 20)
    }
}

function onSetLineTxt(value) {
    setLineTxt(value)
    renderMeme()
}
function onSetTextColor(color) {
    setTextColor(color)
    renderMeme()
}
function onSetFontSize(diff) {
    setFontSize(diff)
    renderMeme()
}
function onAddLine(initValue = 'ENTER TEXT HERE') {
    AddLineToMeme(initValue)
    document.querySelector('.text-input').value = ''
    renderMeme()
}
function onSwitchLines() {
    const val = SwitchLines()
    document.querySelector('.text-input').value = val
    renderMeme()
}
function onSetAlign(alignTo) {
    changeAlign(alignTo)
    renderMeme()
}
function onDeleteLine() {
    DeleteLine()
    renderMeme()
}
function onSetFont(val) {
    setFont(val)
    renderMeme()
}
function onDownloadImg(elLink) {
    const imgCon = gElCanvas.toDataURL('image/jpg')
    elLink.href = imgCon
}
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    renderMeme()
}
function onShareMeme(elLink) {
    shareMeme(elLink)
}

//Drag and Drop
function onDown(ev) {
    const pos = getEvPos(ev)
    if (!selectedLineIsClicked(pos)) return
    setLineDrag(true)
    gDragInterval = true
    gPrevPos = pos

    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    if (!gDragInterval) return

    const pos = getEvPos(ev)
    const dx = pos.x - gPrevPos.x
    const dy = pos.y - gPrevPos.y
    gPrevPos = pos
    moveMeme(dx, dy)
    renderMeme()
}

function getEvPos(ev) {
    let pos = {
        x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
        y: ev.pageY - ev.target.offsetTop - ev.target.clientLeft
    }
    return pos
}

function onUp() {
    gDragInterval = false
    document.body.style.cursor = 'auto'
}


