'use strict'

function onInit(){
    renderGallery()
    initCanvas()
    loadMemesFromStorage()
    
    addMouseListeners()
    window.addEventListener('resize', resizeCanvas)
}
function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}
function  onToggleMenu() {
    document.body.classList.toggle('menu-open')
}