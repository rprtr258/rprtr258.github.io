var message = prompt("Type message:", "Kappa 123");

while(message.indexOf("Kappa") !== -1) {
	message = message.replace("Kappa", "<img src = \"http://static-cdn.jtvnw.net/emoticons/v1/25/1.0\">");
}

var messageElement = document.createElement("div");
messageElement.innerHTML = message;
messageElement.classList.add("alert");
document.body.insertBefore(messageElement, document.getElementById("qqq"));
setInterval(function() {
	messageElement.style = (700 - (parseInt(messageElement.style.width.substring(0, 3)))) + "px";
}, 2000);
messageElement.style = "400px";
