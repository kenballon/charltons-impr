
// START CUSTOM JS >

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.profile-name');

    const isEmptyParagraph = (paragraph) => {
        const normalizedText = paragraph.textContent
            .replace(/\u00A0/g, ' ')
            .trim();
        return normalizedText.length === 0;
    };

    containers.forEach((container) => {
        container.querySelectorAll('br').forEach((lineBreak) => lineBreak.remove());
        container.querySelectorAll('p').forEach((paragraph) => {
            if (isEmptyParagraph(paragraph)) {
                paragraph.remove();
            }
        });
    });

    document
        .querySelector('.toggle-content')
        ?.querySelectorAll('p br')
        .forEach((lineBreak) => lineBreak.remove());

    function calculateReadingTime() {
        const postBody = document.querySelector(".regula_post_body");
        const readTimeDiv = document.getElementById("read_time_mins");
        if (!postBody || !readTimeDiv) return;

        const text = postBody.innerText;
        const words = text.trim().split(/\s+/).length;
        const wordsPerMinute = 200;
        const minutes = Math.ceil(words / wordsPerMinute);

        readTimeDiv.textContent = `${minutes} Minute(s)`;
    }

    // Run it
    calculateReadingTime();
});

// END CUSTOM JS >

