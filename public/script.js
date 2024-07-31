function updateClock() {
    const now = new Date();
    const timeElement = document.querySelector('.time');
    const dateElement = document.querySelector('.date');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    dateElement.textContent = `${dayName}, ${monthName} ${date}`;

    timeElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
        timeElement.style.transform = 'scale(1)';
    }, 100);
}

setInterval(updateClock, 1000);

updateClock();



// function formatUptime(ms) {
//     const seconds = Math.floor(ms / 1000) % 60;
//     const minutes = Math.floor(ms / (1000 * 60)) % 60;
//     const hours = Math.floor(ms / (1000 * 60 * 60));
//     const days = Math.floor(ms / (1000 * 60 * 60 * 24));
//     return `${days}d ${hours}h ${minutes}m ${seconds}s`;
// }

// function updateUptime() {
//     fetch('/api/uptime')
//         .then(response => response.json())
//         .then(data => {
//             const uptimeElement = document.getElementById('uptime');
//             uptimeElement.textContent = `Uptime: ${formatUptime(data.uptime)}`;
//         })
//         .catch(error => {
//             console.error('Error fetching uptime:', error);
//         });
// }

// updateUptime();
// setInterval(updateUptime, 1000);
function createECG() {
    const svg = document.querySelector('.ecg-svg');
    const path = document.querySelector('.ecg-path');
    const endpoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    endpoint.setAttribute("r", "3");
    endpoint.setAttribute("class", "ecg-endpoint");
    svg.appendChild(endpoint);

    const ecgPattern = [
        { x: 0, y: 100 },
        { x: 20, y: 100 },
        { x: 40, y: 100 },
        { x: 50, y: 20 },
        { x: 60, y: 180 },
        { x: 70, y: 80 },
        { x: 90, y: 100 },
        { x: 125, y: 100 },
        { x: 126, y: 100 },
        { x: 150, y: 100 }
    ];

    const totalLength = ecgPattern[ecgPattern.length - 1].x;
    let currentPosition = 0;

    function updateECG() {
        currentPosition += 0.5; 
        if (currentPosition > totalLength) {
            currentPosition = 0;
        }

        let pathData = `M0 100 `;
        let endpointX = 0;
        let endpointY = 100;

        for (let i = 1; i < ecgPattern.length; i++) {
            const prevPoint = ecgPattern[i - 1];
            const currentPoint = ecgPattern[i];
            
            if (currentPosition > prevPoint.x && currentPosition <= currentPoint.x) {
                const ratio = (currentPosition - prevPoint.x) / (currentPoint.x - prevPoint.x);
                endpointX = prevPoint.x + (currentPoint.x - prevPoint.x) * ratio;
                endpointY = prevPoint.y + (currentPoint.y - prevPoint.y) * ratio;
                pathData += `L${endpointX} ${endpointY}`;
                break;
            } else if (currentPosition > currentPoint.x) {
                pathData += `L${currentPoint.x} ${currentPoint.y}`;
            }
        }

        path.setAttribute('d', pathData);
        endpoint.setAttribute('cx', endpointX);
        endpoint.setAttribute('cy', endpointY);

        requestAnimationFrame(updateECG);
    }

    updateECG();
}

document.addEventListener('DOMContentLoaded', createECG);
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});