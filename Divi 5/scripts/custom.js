
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
});

// END CUSTOM JS >
