document.querySelectorAll('.download-version-wrapper a.et_pb_link').forEach(link => {
    const href = link.getAttribute('href');

    console.log('test only');


    // Hide if missing, empty, or only whitespace
    if (!href || href.trim() === '' || href.trim() === '#') {
        link.classList.add('d-none');
    }
});