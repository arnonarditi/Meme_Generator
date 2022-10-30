'use strict'
function getImgs() {
    const keyWord = getKeyword()
    if (!keyWord) return gImgs
    return gImgs.filter(img => img.keywords.includes(keyWord)
    )
}

function getUploadedImgs(){
    return gUploadedImgs
}

