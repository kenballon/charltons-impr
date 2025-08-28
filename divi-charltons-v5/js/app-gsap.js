// wait until DOM is ready
document.addEventListener("DOMContentLoaded", function (event) {

    gsap.registerPlugin(ScrollTrigger, SplitText);
    let tl = gsap.timeline({ delay: 0.002 });

    //wait until images, links, fonts, stylesheets, and js is loaded
    window.addEventListener("load", function (e) {

        let splitProfileName = new SplitText('.profile-name-text', { type: "words, lines", mask: "lines", autoSplit: true });
        let splitProfileRole = new SplitText('.profile_role', { type: "words, lines", mask: "lines", autoSplit: true });
        let splitProfileContactInfo = new SplitText('.profile_contact_info a span', { type: "words, lines", mask: "lines", autoSplit: true });

        gsap.set([splitProfileName.lines, splitProfileRole.lines], { visibility: "visible" });
        gsap.set(".profile_card_wrapper", { visibility: "visible" });
        gsap.set(".profile_contact_info a span", { visibility: "visible" });


        const bgSection = document.querySelector('.lawyer_profile_section.et_pb_with_background');

        if (bgSection) {
            tl.to(bgSection, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                clipPath: "inset(0% 0 0 0)"
            }, "+=0")
        }

        tl.from(".profile_card_wrapper", {
            duration: 0.3,
            opacity: 0,
            yPercent: 10,
            ease: "power2.out"
        })

        tl.from(splitProfileName.lines, {
            duration: 0.4,
            opacity: 0,
            yPercent: 20,
            stagger: 0.1,
            ease: "power2.out",
        })

        tl.from(splitProfileRole.lines, {
            duration: 0.4,
            opacity: 0,
            yPercent: 20,
            stagger: 0.1,
            ease: "power2.out",
        })

        tl.from(splitProfileContactInfo.lines, {
            duration: 0.6,
            opacity: 0,
            yPercent: 20,
            stagger: 0.1,
            ease: "power2.out",
        });


        // Ensure parent elements stay visible after animation
        tl.call(function () {
            gsap.set(['.profile-name-text', '.profile_role', '.profile_card_wrapper', '.profile_contact_info a span'], { visibility: 'visible' });
        });

        console.log("GSAP animation completed for profile card");


    }, false);





});
