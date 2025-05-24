        // Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
    // Cable click logic
    const cableImages = document.querySelectorAll(".cables img");
    const videoElement = document.getElementById("video");
    const staticOverlay = document.querySelector(".static");

    if (staticOverlay) staticOverlay.classList.remove("static-on");

    cableImages.forEach((cableImg) => {
        cableImg.addEventListener("click", function () {
            this.classList.toggle("cable-up");
            if (videoElement.classList.contains("cable-up")) {
                staticOverlay && staticOverlay.classList.add("static-on");
            } else {
                staticOverlay && staticOverlay.classList.remove("static-on");
            }
        });
    });
});

// Power and switch sync
const powerCheckbox = document.getElementById("power");
const switchCheckbox = document.getElementById("switch");

powerCheckbox.addEventListener("change", function () {
    switchCheckbox.checked = powerCheckbox.checked;
});

// CRT text flicker effect
document.addEventListener("DOMContentLoaded", () => {
    const flickerSpans = [
        document.querySelectorAll("h1.crt-text span"),
        document.querySelectorAll("div[cx*='ts:8px'] span"),
        document.querySelectorAll("div[cx*='ts: 16px'] span"),
    ];
    const flickerChances = [0.7, 0.2, 0.25, 0.5, 0.1, 0.6, 0.5, 0.5, 0.5];
    const flickerIntervals = [900, 1400, 1200, 1000, 1500, 900, 800, 800, 800];
    const lastFlickerTimes = Array(flickerSpans[0].length).fill(0);

    function flickerChar(index) {
        function doFlicker(delay = 0) {
            setTimeout(() => {
                flickerSpans.forEach((spanList) => {
                    const span = spanList[index];
                    if (span) span.classList.add("flicker");
                });
                setTimeout(() => {
                    flickerSpans.forEach((spanList) => {
                        const span = spanList[index];
                        if (span) span.classList.remove("flicker");
                    });
                }, 20 + 20 * Math.random());
            }, delay);
        }
        doFlicker();
        if (Math.random() < 0.15) doFlicker(60 + 40 * Math.random());
        lastFlickerTimes[index] = Date.now();
    }

    function flickerOffBlock() {
        const start = flickerSpans[0].length - 4;
        flickerSpans.forEach((spanList) => {
            for (let i = start; i < flickerSpans[0].length; i++) {
                spanList[i].classList.add("off");
            }
        });
        setTimeout(() => {
            flickerSpans.forEach((spanList) => {
                for (let i = start; i < flickerSpans[0].length; i++) {
                    spanList[i].classList.remove("off");
                }
            });
        }, 80 + 40 * Math.random());
    }

    setInterval(() => {
        const now = Date.now();
        flickerChances.forEach((chance, idx) => {
            if (
                now - lastFlickerTimes[idx] > flickerIntervals[idx] &&
                Math.random() < 0.08 * chance
            ) {
                flickerChar(idx);
            }
        });
        if (Math.random() < 0.003) flickerOffBlock();
    }, 120);
});

// Post-it note animation
const postItNote = document.getElementById("postItNote");
let postItClickCount = 0;

postItNote.addEventListener("click", function (event) {
    postItClickCount++;
    if (postItClickCount === 2) {
        postItNote.classList.add("gentle-swivel");
        postItNote.addEventListener(
            "animationend",
            function handler() {
                postItNote.classList.remove("gentle-swivel");
                postItNote.removeEventListener("animationend", handler);
            }
        );
    }
    if (postItClickCount === 3) {
        postItNote.style.pointerEvents = "none";
        const clickX = event.clientX;
        const centerX = window.innerWidth / 2;
        const rotateAmount = ((clickX - centerX) / centerX) * 45;
        const noteRect = postItNote.getBoundingClientRect();
        const noteTop = noteRect.top;
        const fallDistance = window.innerHeight - noteTop + 200;
        let startTime = null;

        function animateFall(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / 1000, 1);
            const eased = progress * progress;
            postItNote.style.transform = `translateY(${
                eased * fallDistance
            }px) rotate(${eased * rotateAmount}deg)`;
            postItNote.style.opacity = 1 - progress;
            if (progress < 1) {
                requestAnimationFrame(animateFall);
            } else {
                postItNote.remove();
            }
        }
        postItNote.style.transformOrigin = "50% 0%";
        requestAnimationFrame(animateFall);
    }
});

// Clone utility functions
function parseCloneAttr(attrValue) {
    let [selector, mode] = attrValue.split(",").map((s) => s.trim());
    return {
        selector,
        mode: (mode || "all").toLowerCase(),
    };
}

function applyClone(target, source, mode) {
    if (mode === "all") {
        target.innerHTML = "";
        let clone = source.cloneNode(true);
        clone.removeAttribute("id");
        clone.removeAttribute("clone");
        copyComputedStyle(clone, source);
        target.appendChild(clone);
    } else if (mode === "content") {
        target.innerHTML = source.innerHTML;
    } else if (mode === "style") {
        copyComputedStyle(target, source);
    }
}

function copyComputedStyle(target, source) {
    let computed = getComputedStyle(source);
    for (let prop of computed) {
        target.style[prop] = computed.getPropertyValue(prop);
    }
}

function observeAndClone(target, source, mode) {
    applyClone(target, source, mode);
    let observer = new MutationObserver(() => {
        applyClone(target, source, mode);
    });
    observer.observe(source, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
    });
    if (mode === "style" || mode === "all") {
        let styleObserver = new MutationObserver(() => {
            applyClone(target, source, mode);
        });
        styleObserver.observe(source, {
            attributes: true,
            attributeFilter: ["style", "class"],
        });
    }
}

function setupClones() {
    document.querySelectorAll("[clone]").forEach((cloneElem) => {
        let { selector, mode } = parseCloneAttr(cloneElem.getAttribute("clone"));
        let sourceElem = document.querySelector(selector);
        if (sourceElem) observeAndClone(cloneElem, sourceElem, mode);
    });
}

document.addEventListener("DOMContentLoaded", setupClones);

// Counter update logic
function updateCounters() {
    const counterSpans = {
        visits: document.querySelector(".counters li.visits span:last-child"),
        uniqueVisits: document.querySelector(
            ".counters li.uniq-visits span:last-child"
        ),
        onSite: document.querySelector(".counters li.on-site span:last-child"),
    };
    const counterImgs = {
        visits: document.querySelectorAll(".real-counters li.all-visits img"),
        uniqueVisits: document.querySelectorAll(
            ".real-counters li.visits img"
        ),
        onSite: document.querySelectorAll(".real-counters li.viewers img"),
    };

    function getCounterValue(imgList) {
        let digits = [];
        imgList.forEach((img) => {
            let src = img.getAttribute("src");
            if (!src.includes("l.gif") && !src.includes("r.gif")) {
                let match = src.match(/\/([0-9])\.gif$/);
                if (match && match[1]) digits.push(match[1]);
            }
        });
        return digits.length > 0
            ? digits.join("").padStart(8, "0")
            : "00000000";
    }

    if (counterSpans.visits)
        counterSpans.visits.textContent = getCounterValue(counterImgs.visits);
    if (counterSpans.uniqueVisits)
        counterSpans.uniqueVisits.textContent = getCounterValue(
            counterImgs.uniqueVisits
        );
    if (counterSpans.onSite)
        counterSpans.onSite.textContent = getCounterValue(counterImgs.onSite);
}

setInterval(updateCounters, 500);

// Wire animation
function animateWires() {
    const wireSvgs = document.querySelectorAll('svg[role="wire"]');
    const now = performance.now() / 1000;
    wireSvgs.forEach((svg) => {
        const width = svg.clientWidth;
        const baseSag = parseFloat(svg.dataset.basesag) || 30;
        const amplitude = parseFloat(svg.dataset.amplitude) || 20;
        let path = svg.querySelector("path");
        if (!path) {
            path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );
            svg.appendChild(path);
        }
        const d = `M0,0 C ${width / 3},${baseSag + amplitude * Math.sin(now)} ${
            (2 * width) / 3
        },${baseSag + amplitude * Math.cos(now)} ${width},0`;
        path.setAttribute("d", d);
    });
    requestAnimationFrame(animateWires);
}
animateWires();

// Spark and emitter classes
const GRAVITY = 0.5;
const DECAY_BASE = 0.03;
const DECAY_RANDOM = 0.03;
const VELOCITY_X = 15;
const VELOCITY_Y = 10;

class Spark {
    constructor(x, y) {
        this.element = document.createElement("div");
        this.element.className = "spark";
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * VELOCITY_X;
        this.velocityY = (Math.random() - 1) * VELOCITY_Y;
        this.gravity = GRAVITY;
        this.life = 1;
        this.decay = DECAY_BASE * Math.random() + DECAY_RANDOM;
        document.body.appendChild(this.element);
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        this.update();
    }
    updateRotation() {
        let angle = Math.atan2(this.velocityY, this.velocityX);
        this.element.style.transform = `rotate(${(angle * 180) / Math.PI}deg)`;
    }
    update() {
        if (this.life > 0) {
            this.velocityY += this.gravity;
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.life -= this.decay;
            if (
                this.x < -100 ||
                this.x > window.innerWidth + 100 ||
                this.y < -100 ||
                this.y > window.innerHeight + 100
            ) {
                this.life = 0;
            }
            this.element.style.left = this.x + "px";
            this.element.style.top = this.y + "px";
            this.element.style.opacity = this.life;
            this.updateRotation();
            requestAnimationFrame(() => this.update());
        } else {
            this.element.remove();
        }
    }
}

class SparkEmitter {
    constructor(element) {
        this.element = element;
        this.spawnRate = parseInt(element.dataset.spawn) || 30;
        this.x = 0;
        this.y = 0;
        this.updatePosition();
        this.start();
    }
    updatePosition() {
        const rect = this.element.getBoundingClientRect();
        this.x = rect.left + rect.width / 2;
        this.y = rect.top + rect.height / 2;
    }
    start() {
        const emit = () => {
            if (Math.random() * 100 < this.spawnRate) {
                new Spark(this.x, this.y);
            }
            requestAnimationFrame(emit);
        };
        emit();
    }
}

document.querySelectorAll(".emitter").forEach((emitterElem) => {
    const emitter = new SparkEmitter(emitterElem);
    window.addEventListener("resize", () => emitter.updatePosition());
});

// Warning flicker
const warningElement = document.querySelector(".warning");

function getRandomOpacity() {
    return 0.8 * Math.random() + 0.2;
}

function getRandomDuration() {
    return 140 * Math.random() + 20;
}

function applyBrokenFlicker() {
    const flickerCount = Math.floor(5 * Math.random()) + 3;
    let flickerStep = 0;
    (function flicker() {
        if (flickerStep < flickerCount) {
            const opacity = getRandomOpacity();
            const duration = getRandomDuration();
            warningElement.style.opacity = opacity;
            setTimeout(() => {
                warningElement.style.opacity = 1;
                flickerStep++;
                flicker();
            }, duration);
        } else {
            warningElement.style.opacity = 1;
            setTimeout(applyBrokenFlicker, 10000 * Math.random() + 5000);
        }
    })();
}
applyBrokenFlicker();

// LED blink
function getRandomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

function blinkLED(ledElement, minInterval, maxInterval) {
    (function toggle() {
        ledElement.classList.toggle("off");
        const interval = getRandomInterval(minInterval, maxInterval);
        setTimeout(toggle, interval);
    })();
}

const redLED = document.querySelector(".led.active");
const greenLED = document.querySelector(".led.green");
blinkLED(redLED, 50, 1500);
blinkLED(greenLED, 50, 1500);

// Proximity sound logic
document.addEventListener("DOMContentLoaded", () => {
    const soundElements = document.querySelectorAll(
        "[data-sound][data-maxvol][data-maxdist]"
    );
    const audioMap = new Map();

    soundElements.forEach((elem) => {
        const soundSrc = elem.getAttribute("data-sound");
        const audio = new Audio(soundSrc);
        audio.loop = true;
        audio.volume = 0;
        audio.play();
        audioMap.set(elem, audio);
    });

    function getDistance(mouseX, mouseY, elem) {
        const rect = elem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.sqrt(
            Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
        );
    }

    function updateVolumes(mouseX, mouseY) {
        soundElements.forEach((elem) => {
            const maxVol = parseFloat(elem.getAttribute("data-maxvol")) || 1;
            const maxDist = parseFloat(elem.getAttribute("data-maxdist")) || 100;
            const distance = getDistance(mouseX, mouseY, elem);
            const audio = audioMap.get(elem);
            if (distance <= maxDist) {
                const volume = maxVol * (1 - distance / maxDist);
                audio.volume = Math.max(0, Math.min(volume, maxVol));
            } else {
                audio.volume = 0;
            }
        });
    }

    document.addEventListener("mousemove", (event) => {
        updateVolumes(event.clientX, event.clientY);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            audioMap.forEach((audio) => {
                audio.volume = 0;
            });
        }
    });
});

// FC2 Counter script loader
(function () {
    if (window.__fc2CountersLoaded) return;
    window.__fc2CountersLoaded = true;
    document.addEventListener("DOMContentLoaded", function () {
        const countersDiv = document.querySelector(".real-counters");
        if (!countersDiv) return;

        function addScriptToLi(selector, src) {
            const li = countersDiv.querySelector(selector);
            if (!li) return;
            if (
                Array.from(li.getElementsByTagName("script")).some(
                    (s) => s.src === src
                )
            ) {
                return;
            }
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            li.appendChild(script);
        }

        const isLocal =
            location.hostname === "localhost" ||
            location.hostname === "127.0.0.1";
        if (!isLocal) {
            addScriptToLi(
                ".all-visits",
                "//counter1.fc2.com/counter.php?id=89511230"
            );
        }
        addScriptToLi(
            ".visits",
            "https://counter1.fc2.com/counter.php?id=40270682&main=1"
        );
        addScriptToLi(
            ".viewers",
            "https://counter1.fc2.com/views.php?id=40270682&main=1"
        );
    });
})();
