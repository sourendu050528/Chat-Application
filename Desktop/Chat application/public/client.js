const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
const encryptionKey = 'bXc3E9Lf6N7vGmQkR0Xn2Wp4Vt8Yz1Jx';

do {
    name = prompt('Please enter your name: ');
} while (!name);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        sendMessage(e.target.value);
        textarea.value = '';
    }
});

function sendMessage(message) {
    if (!message.trim()) return;

    let msg = {
        user: name,
        message: encryptMessage(message.trim())
    };

    appendMessage({ user: name, message: message.trim() }, 'outgoing');
    scrollToBottom();

    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);

}

function encryptMessage(message) {
    return CryptoJS.AES.encrypt(message, encryptionKey).toString();
}

function decryptMessage(encryptedMessage) {
    let bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

socket.on('message', (msg) => {
    msg.message = decryptMessage(msg.message);
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}