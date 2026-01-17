/* ==========================================================================
   1. BLACKHOLE PARTICLE SYSTEM (Vanilla JS Refactor)
   ========================================================================== */
function blackhole(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let h = element.offsetHeight;
    let w = element.offsetWidth;
    let cw = w;
    let ch = h;
    let maxorbit = 255; // Distance from center
    let centery = ch / 2;
    let centerx = cw / 2;

    const startTime = new Date().getTime();
    let currentTime = 0;

    let stars = [];
    let collapse = false; // hovered
    let expanse = false; // clicked

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    element.appendChild(canvas);
    const context = canvas.getContext("2d");

    // Setting globalCompositeOperation to 'source-over' since user used 'multiply' on dark background 
    // which might make white stars invisible. 'screen' or 'lighter' is usually better for space.
    // However, trying to replicate user visual:
    context.globalCompositeOperation = "screen"; 

    function setDPI(canvas, dpi) {
        if (!canvas.style.width) canvas.style.width = canvas.width + 'px';
        if (!canvas.style.height) canvas.style.height = canvas.height + 'px';

        const scaleFactor = dpi / 96;
        canvas.width = Math.ceil(canvas.width * scaleFactor);
        canvas.height = Math.ceil(canvas.height * scaleFactor);
        const ctx = canvas.getContext('2d');
        ctx.scale(scaleFactor, scaleFactor);
    }

    function rotate(cx, cy, x, y, angle) {
        const radians = angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }

    setDPI(canvas, 192);

    class Star {
        constructor() {
            const rands = [];
            rands.push(Math.random() * (maxorbit / 2) + 1);
            rands.push(Math.random() * (maxorbit / 2) + maxorbit);

            this.orbital = (rands.reduce((p, c) => p + c, 0) / rands.length);
            this.x = centerx;
            this.y = centery + this.orbital;
            this.yOrigin = centery + this.orbital;

            this.speed = (Math.floor(Math.random() * 2.5) + 1.5) * Math.PI / 180;
            this.rotation = 0;
            this.startRotation = (Math.floor(Math.random() * 360) + 1) * Math.PI / 180;

            this.id = stars.length;
            this.collapseBonus = this.orbital - (maxorbit * 0.7);
            if (this.collapseBonus < 0) this.collapseBonus = 0;

            this.color = 'rgba(255,255,255,' + (1 - ((this.orbital) / 255)) + ')';
            this.hoverPos = centery + (maxorbit / 2) + this.collapseBonus;
            this.expansePos = centery + (this.id % 100) * -10 + (Math.floor(Math.random() * 20) + 1);

            this.prevR = this.startRotation;
            this.prevX = this.x;
            this.prevY = this.y;
        }

        draw() {
            if (!expanse) {
                this.rotation = this.startRotation + (currentTime * this.speed);
                if (!collapse) { // Not hovered
                    if (this.y > this.yOrigin) {
                        this.y -= 2.5;
                    }
                    if (this.y < this.yOrigin - 4) {
                        this.y += (this.yOrigin - this.y) / 10;
                    }
                } else { // Hovered
                    this.trail = 1;
                    if (this.y > this.hoverPos) {
                        this.y -= (this.hoverPos - this.y) / -5;
                    }
                    if (this.y < this.hoverPos - 4) {
                        this.y += 2.5;
                    }
                }
            } else { // Expanse (Clicked)
                this.rotation = this.startRotation + (currentTime * (this.speed / 2));
                if (this.y > this.expansePos) {
                    this.y -= Math.floor(this.expansePos - this.y) / -140;
                }
            }

            context.save();
            context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.beginPath();
            
            const oldPos = rotate(centerx, centery, this.prevX, this.prevY, -this.prevR);
            context.moveTo(oldPos[0], oldPos[1]);
            
            // Transform matrix for rotation
            context.translate(centerx, centery);
            context.rotate(this.rotation);
            context.translate(-centerx, -centery);
            
            context.lineTo(this.x, this.y);
            context.stroke();
            context.restore();

            this.prevR = this.rotation;
            this.prevX = this.x;
            this.prevY = this.y;
        }
    }

    // Interaction Listeners
    const centerBtn = document.querySelector('.centerHover');
    
    if (centerBtn) {
        centerBtn.addEventListener('click', () => {
            collapse = false;
            expanse = true;
            centerBtn.classList.add('open');
            
            // Trigger site entrance
            document.body.classList.add('entered');
            
            // Warp/Scroll to About Me after short delay for effect
            // User requested to stay on Landing/Home section
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        });

        centerBtn.addEventListener('mouseover', () => {
            if (!expanse) collapse = true;
        });

        centerBtn.addEventListener('mouseout', () => {
            if (!expanse) collapse = false;
        });
    }

    // Window Resize
    window.addEventListener('resize', () => {
        w = element.offsetWidth;
        h = element.offsetHeight;
        cw = w;
        ch = h;
        centerx = cw / 2;
        centery = ch / 2;
        canvas.width = cw;
        canvas.height = ch;
        // setDPI(canvas, 192); // Re-setting DPI logic might reset context
    });

    function loop() {
        const now = new Date().getTime();
        currentTime = (now - startTime) / 50;

        context.fillStyle = 'rgba(25,25,25,0.2)'; // Clear with transparency for trails
        context.fillRect(0, 0, cw, ch);

        for (let i = 0; i < stars.length; i++) {
            stars[i].draw();
        }

        requestAnimationFrame(loop);
    }

    function init() {
        context.fillStyle = 'rgba(25,25,25,1)';
        context.fillRect(0, 0, cw, ch);
        
        for (let i = 0; i < 2500; i++) {
            stars.push(new Star());
        }
        loop();
    }

    init();
}

/* ==========================================================================
   2. MAIN LOGIC (Initialize & UI)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    
    // Initialize Blackhole
    blackhole('blackhole');

    // UI Logic (Mobile Menu, Scroll Reveal, etc.)
    const burger = document.getElementById('burger-icon');
    const navList = document.getElementById('nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    burger.addEventListener('click', () => {
        navList.classList.toggle('active');
        burger.querySelector('i').classList.toggle('fa-times');
        burger.querySelector('i').classList.toggle('fa-bars');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.tech-section').forEach(section => {
        observer.observe(section);
    });

    const goUpBtn = document.getElementById("goUpBtn");
    
    window.addEventListener("scroll", function () {
        if (window.scrollY > 500) {
            goUpBtn.style.display = "flex";
            goUpBtn.style.justifyContent = "center";
            goUpBtn.style.alignItems = "center";
        } else {
            goUpBtn.style.display = "none";
        }
    });

    goUpBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

