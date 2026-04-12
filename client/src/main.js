import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Disable right-click, F12, and developer tools
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
}, false);

document.addEventListener('keydown', function(e) {
    // Block F12
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
});

// Periodically check if devtools are open
function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    if ((widthThreshold || heightThreshold) && window.firefox === undefined) {
        document.body.innerHTML = '<h1>Developer tools detected. Page blocked.</h1>';
        document.body.style.backgroundColor = '#000';
        document.body.style.color = '#fff';
        document.body.style.textAlign = 'center';
        document.body.style.paddingTop = '40%';
        document.body.style.fontFamily = 'Arial, sans-serif';
        // Prevent further interaction
        document.addEventListener('click', function(e) { e.preventDefault(); }, false);
        document.addEventListener('keydown', function(e) { e.preventDefault(); }, false);
    }
}

setInterval(detectDevTools, 1000);

createApp(App).mount('#app')
