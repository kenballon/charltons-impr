// wait until DOM is ready
document.addEventListener("DOMContentLoaded", (event) => {

    gsap.registerPlugin(ScrollTrigger, SplitText);
    let tl = gsap.timeline({ delay: 0.002 });

    let splitProfileName = new SplitText('#profile_name_text', { type: "lines", mask: "lines", autoSplit: true });
    let splitProfileRole = new SplitText('.profile_role', { type: "lines", mask: "lines", autoSplit: true });
    let splitProfileDesc = new SplitText('.profile_contact_info a span', { type: "lines", mask: "lines", autoSplit: true });

    const bgSection = document.querySelector('.lawyer_profile_section.et_pb_with_background');
    const profileCards = document.querySelectorAll('.profile_card_wrapper');

    if (bgSection) {
        tl.to(bgSection, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clipPath: "inset(0% 0 0 0)"
        }, "+=0")
    }

    if (profileCards) {
        profileCards.forEach(card => {
            tl.from(card, {
                duration: 0.3,
                stagger: 0.05,
                opacity: 0,
                yPercent: 10,
                ease: "power2.out",
            }, "+=0.02")
        });
    }


    tl.from(splitProfileName.lines, {
        duration: 0.2,
        stagger: 0.05,
        opacity: 0,
        yPercent: 10,
        ease: "power2.out",
    })

    tl.from(splitProfileRole.lines, {
        duration: 0.2,
        stagger: 0.05,
        opacity: 0,
        yPercent: 10,
        ease: "power2.out",
    })

    tl.from(splitProfileDesc.lines, {
        duration: 0.2,
        stagger: 0.05,
        opacity: 0,
        yPercent: 10,
        ease: "power2.out",
    })

    console.log("GSAP animation completed for profile card");
});

