const correctPassword = "entropylegacy2002!*";

window.onload = function () {
    document.getElementById("login-screen").style.display = "flex";
};

function checkPassword() {
    const passwordInput = document.getElementById("passwordInput");
    const errorMessage = document.getElementById("error-message");
    
if (passwordInput.value.trim() === "") {
    errorMessage.textContent = "⚠️ Please enter a password.";
    passwordInput.style.border = "2px solid red";
    return;
}
resetError();

if (passwordInput.value === correctPassword) {
    document.getElementById("login-screen").style.display = "none";
    } else {
        errorMessage.textContent = "❌ Incorrect password, try again.";
        passwordInput.style.border = "2px solid red";
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
}

function resetError() {
    document.getElementById("passwordInput").style.border = "1px solid #ccc";
    document.getElementById("error-message").textContent = "";
    document.getElementById("passwordInput").type = "password";
}

function togglePassword() {
    const passwordField = document.getElementById("passwordInput");
    const toggleButton = document.getElementById("togglePassword");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        passwordField.type = "password";
        toggleButton.textContent = "Show";
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('video');
    const pipButton = document.getElementById('pipButton');
    const channelListElement = document.getElementById('channelList');
    const videoContainer = document.getElementById('videoContainer');

    if (!document.pictureInPictureEnabled) {
        pipButton.style.display = 'none';
    }

    pipButton.addEventListener('click', () => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else {
            videoElement.requestPictureInPicture().catch(error => {
                console.error('Error entering PiP mode: ', error);
            });
        }
    });

    const player = new shaka.Player(videoElement);
    const ui = new shaka.ui.Overlay(player, videoContainer, videoElement);

    ui.configure({
        'overflowMenuButtons': ['quality', 'language', 'captions', 'playback_rate', 'cast']
    });

    async function loadChannel(channel) {
        videoElement.style.display = "block";
        videoContainer.classList.add("active");

        if (!shaka.Player.isBrowserSupported()) {
            alert("Your browser does not support Shaka Player.");
            return;
        }

        try {
            await player.attach(videoElement);
            player.configure({
                drm: {
                    clearKeys: {
                        [channel.key.split(":")[0]]: channel.key.split(":")[1]
                    }
                }
            });

            await player.load(channel.src);
            videoElement.play().catch(error => console.warn("Autoplay failed: User interaction needed", error));
        } catch (error) {
            console.error("Error loading video:", error);
            alert("Error loading channel: " + channel.name);
        }
    }

    function populateChannels() {
        channels.forEach((channel) => {
            const li = document.createElement('li');
            li.textContent = channel.name;
            li.onclick = () => {
                document.querySelectorAll('.channel-list li').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                loadChannel(channel);
            };
            channelListElement.appendChild(li);
        });
    }

    function searchChannels() {
        let input = document.getElementById('searchInput').value.toLowerCase();
        document.querySelectorAll('.channel-list li').forEach(channel => {
            channel.style.display = channel.textContent.toLowerCase().includes(input) ? "list-item" : "none";
        });
    }

    populateChannels();
    window.searchChannels = searchChannels;
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

function ctrlShiftKey(e, keyCode) {
    return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
    }

document.onkeydown = (e) => {
    if (
        e.keyCode === 123 ||
        ctrlShiftKey(e, 'I') ||
        ctrlShiftKey(e, 'J') ||
        ctrlShiftKey(e, 'C') ||
        (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
        )
        return false;
};