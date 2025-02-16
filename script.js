document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('video');
    const channelListElement = document.getElementById('channelList');
    const videoContainer = document.getElementById('videoContainer');

    if (!shaka.Player.isBrowserSupported()) {
        alert("Your browser does not support Shaka Player.");
        return;
    }

    const player = new shaka.Player(videoElement);
    const ui = new shaka.ui.Overlay(player, videoContainer, videoElement);
    
    videoContainer['ui'] = ui;

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
