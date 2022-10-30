'use strict'
function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function clearDetailFromStorage(){
  localStorage.removeItem(S_key_Detail_Modal)  
}

function setItem(key,val){
  localStorage.setItem(key,val)
}

function getItem(key){
  return localStorage.getItem(key)
}