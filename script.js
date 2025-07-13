document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    // Scene and Boot elements
    const redButton = document.getElementById('redButton');
    const scene1 = document.getElementById('scene1'); // Keep for hiding/showing the img itself
    const scene2 = document.getElementById('scene2');
    const ledScreenOverlay = document.querySelector('.led-screen-overlay');
    const desktopIcons = document.querySelector('.desktop-icons');
    const bootSound = document.getElementById('bootSound');
    const backButton = document.getElementById('monitorBackButton');
    const instructionBox = document.getElementById('instructionBox'); // Instruction Box

    // NEW SELECTION: The wrapper for scene1
    const sceneOneInteractiveArea = document.querySelector('.scene-one-interactive-area');

    // Windows
    const projectsWindow = document.getElementById('projectsWindow');
    const socialsWindow = document.getElementById('socialsWindow');
    const contactIntroPopup = document.getElementById('contactIntroPopup');
    const contactFormWindow = document.getElementById('contactFormWindow');
    const knowMeWindow = document.getElementById('knowMeWindow');
    const marutiCelerioPopup = document.getElementById('marutiCelerioPopup');
    const marutiArcadePopup = document.getElementById('marutiArcadePopup');
    const marutiFronxPopup = document.getElementById('marutiFronxPopup');
    const bhimUpiPopup = document.getElementById('bhimUpiPopup');

    // Desktop icons
    const projectsIcon = document.querySelector('.projects-icon');
    const socialsIcon = document.querySelector('.socials-icon');
    const contactIcon = document.querySelector('.contact-icon');
    const knowMeIcon = document.querySelector('.know-me-icon');

    // Project Specific Popups (Folders within Projects)
    const rbiPopup = document.getElementById('rbiPopup');
    const baghCottonsPopup = document.getElementById('baghCottonsPopup');
    const axisBankPopup = document.getElementById('axisBankPopup');
    const dentsuReflectionPopup = document.getElementById('dentsuReflectionPopup');

    // Contact Form related
    const proceedToContactFormButton = document.getElementById('proceedToContactForm');
    const contactForm = document.getElementById('contactForm');

    // Dino Game elements
    const character = document.getElementById('character');
    const block = document.getElementById('block');
    const gameContainer = document.getElementById('gameContainer');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartButton = document.getElementById('restartButton');
    const introScreen = document.getElementById('introScreen');
    const socialLinksContainer = document.getElementById('socialLinksContainer');
    const skipGame = document.getElementById('skipGame');
    const skipGameIntro = document.getElementById('skipGameIntro');

    let zIndexCounter = 100; // Starting z-index for windows

    // Variable to hold the timeout ID for the instruction box
    let instructionBoxTimeoutId;


    // --- Helper Functions ---

    // All windows for initial setup (hiding them)
    const allWindows = document.querySelectorAll('.window');
    allWindows.forEach(win => win.classList.add('fade-hidden'));

    // Preload images for smoother transitions
    const imageUrlsToPreload = [
        'images/scene1.jpg',
        'images/scene2.jpg',
        'images/dino.png',
        'images/cactus1.png',
        'images/amisha.png',
        'images/camera.png'
    ];

    imageUrlsToPreload.forEach(url => {
        const img = new Image();
        img.src = url;
    });


    /**
     * Closes all currently visible window pop-ups by adding the 'fade-hidden' class.
     * This is crucial for managing overlapping windows.
     */
    function closeAllOpenWindows() {
        document.querySelectorAll('.window:not(.fade-hidden)').forEach(window => {
            window.classList.add('fade-hidden');
            window.classList.remove('active'); // Ensure 'active' class is removed

            // Reset any specific animations when closing a window
            if (window.id === 'socialsWindow') {
                resetGame(); // Ensure game resets when socials window is closed
            }
            // Reset for Know Me window animation
            if (window.id === 'knowMeWindow') {
                const amishaRevealImg = document.getElementById('amishaRevealImg');
                if (amishaRevealImg) {
                    amishaRevealImg.classList.remove('visible'); // Remove animation class to reset its state
                }
            }
        });
        document.querySelectorAll('.popup-image-full').forEach(img => {
            img.classList.add('fade-hidden');
            img.classList.remove('active');
        });
    }

    /**
     * Generic function to make any window element draggable.
     * @param {HTMLElement} element - The window element to make draggable.
     */
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.window-header');

        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Bring the clicked window to the front
            element.style.zIndex = ++zIndexCounter;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // Boundary checks to keep window within parent (viewport)
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const elementRect = element.getBoundingClientRect();

            if (newTop < 0) newTop = 0;
            if (newLeft < 0) newLeft = 0;
            if (newTop + elementRect.height > viewportHeight) newTop = viewportHeight - elementRect.height;
            if (newLeft + elementRect.width > viewportWidth) newLeft = viewportWidth - elementRect.width;

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /**
     * Sets up close and maximize controls for a given window element.
     * Also applies draggable functionality.
     * @param {HTMLElement} windowElement - The window element (div with class 'window').
     */
    function setupWindowControls(windowElement) {
        if (!windowElement) {
            console.warn("setupWindowControls called with a null or undefined element.");
            return;
        }

        const closeButton = windowElement.querySelector('.window-control-button.close');
        const maximizeButton = windowElement.querySelector('.window-control-button.maximize');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                windowElement.classList.add('fade-hidden');
                windowElement.classList.remove('active');

                // Explicitly set display to 'none' after transition (if desired for space)
                // For windows, we keep them as 'flex' during transition then back to 'none'
                // And .window CSS initially sets display: none which is then overridden by .active

                if (windowElement.id === 'socialsWindow') {
                    resetGame();
                }
                if (windowElement.id === 'knowMeWindow') {
                    const amishaRevealImg = document.getElementById('amishaRevealImg');
                    if (amishaRevealImg) {
                        amishaRevealImg.classList.remove('visible');
                    }
                }
            });
        }

        if (maximizeButton) {
            maximizeButton.addEventListener('click', () => {
                windowElement.classList.toggle('maximized');
                if (windowElement.classList.contains('maximized')) {
                    windowElement.style.top = '';
                    windowElement.style.left = '';
                    windowElement.style.transform = '';
                } else {
                    windowElement.style.top = '50%';
                    windowElement.style.left = '50%';
                    windowElement.style.transform = 'translate(-50%, -50%)';
                }
            });
        }

        makeDraggable(windowElement);

        windowElement.addEventListener('mousedown', () => {
            windowElement.style.zIndex = ++zIndexCounter;
        });
    }

    /**
     * Opens a given window element by removing 'fade-hidden' class and setting z-index.
     * @param {HTMLElement} windowElement - The window to open.
     */
    function openWindow(windowElement) {
        if (!windowElement) {
            console.error("Attempted to open a null or undefined windowElement.");
            return;
        }
        closeAllOpenWindows();
        windowElement.classList.remove('fade-hidden');
        windowElement.classList.add('active'); // This class makes it display: flex/block and sets opacity
        windowElement.style.zIndex = ++zIndexCounter;

        if (windowElement === knowMeWindow) {
            const amishaRevealImg = document.getElementById('amishaRevealImg');
            if (amishaRevealImg) {
                amishaRevealImg.classList.remove('visible');
                // Small delay to ensure the image resets before re-animating if opened consecutively
                setTimeout(() => {
                    amishaRevealImg.classList.add('visible');
                }, 100);
            }
        }
    }


    // --- Apply Window Controls to All Windows ---
    if (projectsWindow) setupWindowControls(projectsWindow);
    if (socialsWindow) setupWindowControls(socialsWindow);
    if (contactFormWindow) setupWindowControls(contactFormWindow);
    if (contactIntroPopup) setupWindowControls(contactIntroPopup);
    if (rbiPopup) setupWindowControls(rbiPopup);
    if (baghCottonsPopup) setupWindowControls(baghCottonsPopup);
    if (axisBankPopup) setupWindowControls(axisBankPopup);
    if (dentsuReflectionPopup) setupWindowControls(dentsuReflectionPopup);
    if (knowMeWindow) setupWindowControls(knowMeWindow);
    if (marutiCelerioPopup) setupWindowControls(marutiCelerioPopup);
    if (marutiArcadePopup) setupWindowControls(marutiArcadePopup);
    if (marutiFronxPopup) setupWindowControls(marutiFronxPopup);
    if (bhimUpiPopup) setupWindowControls(bhimUpiPopup);


    // Instruction Box Initial Appearance Logic
    if (instructionBox) {
        // Ensure it starts hidden by applying fade-hidden
        instructionBox.classList.add('fade-hidden');
        // The instruction box will appear after 5 seconds
        instructionBoxTimeoutId = setTimeout(() => { // Store the timeout ID
            // Set display to block first, then remove fade-hidden to trigger transition
            instructionBox.style.display = 'block'; // Make it block before fading in
            requestAnimationFrame(() => { // Use rAF to ensure display change is rendered before transition
                instructionBox.classList.remove('fade-hidden');
                instructionBox.classList.add('fade-visible'); // Use fade-visible to control appearance
            });
        }, 5000); // 5 seconds
    }

    // Boot Up Sequence
    redButton.addEventListener('click', () => {
        // Hide the instruction box immediately when the red button is pressed
        if (instructionBox) {
            // Check if the timeout to show the instruction box is still pending
            if (instructionBoxTimeoutId) {
                clearTimeout(instructionBoxTimeoutId); // Clear the timeout if it hasn't fired yet
                instructionBoxTimeoutId = null; // Reset the ID
                // Immediately ensure it's hidden and not just waiting for the timeout to override
                instructionBox.style.display = 'none';
                instructionBox.classList.remove('fade-visible'); // Remove this class to prevent it from ever showing
                instructionBox.classList.add('fade-hidden'); // Ensure hidden class is there for consistency
            } else {
                // If the instruction box is already visible (timeout has fired), fade it out
                instructionBox.classList.remove('fade-visible'); // Remove this first to ensure proper transition
                instructionBox.classList.add('fade-hidden'); // This initiates the fade-out

                // Use a named function for the event listener so it can be removed properly
                function handleInstructionBoxTransitionEnd(event) {
                    // Only proceed if the opacity transition specifically finished AND the box is meant to be hidden
                    if (event.propertyName === 'opacity' && instructionBox.classList.contains('fade-hidden')) {
                        instructionBox.style.display = 'none'; // Finally hide it
                        // Remove the event listener to prevent it from firing again accidentally
                        instructionBox.removeEventListener('transitionend', handleInstructionBoxTransitionEnd);
                    }
                }
                instructionBox.addEventListener('transitionend', handleInstructionBoxTransitionEnd);
            }
        }

        if (bootSound) {
            bootSound.play();
        }

        redButton.classList.add('fade-hidden');
        // APPLY ZOOMING TO THE NEW WRAPPER
        sceneOneInteractiveArea.classList.add('zooming');

        setTimeout(() => {
            // Hide the wrapper for scene1 after zoom completes
            sceneOneInteractiveArea.style.display = 'none';
            sceneOneInteractiveArea.classList.remove('zooming', 'active'); // Remove active from wrapper

            // Ensure scene1 image itself is also hidden/inactive if it was active
            scene1.classList.remove('active'); // Remove active from the image itself
            scene1.style.display = 'none'; // Ensure the image itself is hidden

            // Show scene2
            scene2.style.display = 'block';
            scene2.classList.add('active'); // Mark scene2 as active

            // Set display to block/flex first, then remove fade-hidden to trigger fade-in
            ledScreenOverlay.style.display = 'block';
            desktopIcons.style.display = 'flex';
            backButton.style.display = 'block';

            // Now remove the fade-hidden class to start the opacity transition
            ledScreenOverlay.classList.remove('fade-hidden');
            desktopIcons.classList.remove('fade-hidden');
            backButton.classList.remove('fade-hidden');
        }, 1500); // This timeout should match your zoomIn animation duration
    });

   // Monitor Back Button Event Listener
if (backButton) {
    backButton.addEventListener('click', () => {
        closeAllOpenWindows();

        // 1. Start fade-out effect for opacity (0.5s) and visibility (after 0.5s)
        desktopIcons.classList.add('fade-hidden');
        ledScreenOverlay.classList.add('fade-hidden');
        backButton.classList.add('fade-hidden');

        // 2. Immediately set display to 'none' for instant hiding,
        // so they don't occupy space or flash even if invisible.
        // This is crucial for elements that should completely vanish.
        desktopIcons.style.display = 'none';
        ledScreenOverlay.style.display = 'none';
        backButton.style.display = 'none';

        scene2.style.display = 'none'; // Hide scene2 immediately
        scene2.classList.remove('active'); // Remove active from scene2

        // SHOW THE WRAPPER FOR SCENE1 AND APPLY ZOOMING-OUT
        sceneOneInteractiveArea.style.display = 'block';
        sceneOneInteractiveArea.classList.add('active'); // Mark wrapper active
        sceneOneInteractiveArea.classList.remove('zooming'); // Ensure zooming is removed before zooming-out
        sceneOneInteractiveArea.classList.add('zooming-out');

        // Also ensure scene1 image inside the wrapper is shown
        scene1.style.display = 'block';
        scene1.classList.add('active');

        if (bootSound) {
            bootSound.currentTime = 0;
            bootSound.play();
        }

        // This setTimeout is only needed to remove the 'zooming-out' class
        // and make the red button visible after scene1's animation completes.
        setTimeout(() => {
            // Remove zooming-out from the wrapper
            sceneOneInteractiveArea.classList.remove('zooming-out');
            redButton.classList.remove('fade-hidden'); // Red button fades back in
        }, 1700); // This timeout should match your zoomOut animation duration
    });
} else {
    console.error("Error: The 'monitorBackButton' element was not found.");
}

    // Desktop Icon Clicks
    projectsIcon.addEventListener('click', () => {
        openWindow(projectsWindow);
    });

    socialsIcon.addEventListener('click', () => {
        openWindow(socialsWindow);
        resetGame(); // Ensure game resets when socials window is opened
    });

    // Know Me Icon Click
    knowMeIcon.addEventListener('click', () => {
        openWindow(knowMeWindow);
    });

    // --- CONTACT ICON AND POPUP LOGIC ---
    contactIcon.addEventListener('click', () => {
        openWindow(contactIntroPopup);
    });

    if (proceedToContactFormButton) {
        proceedToContactFormButton.addEventListener('click', () => {
            contactIntroPopup.classList.add('fade-hidden');
            setTimeout(() => {
                openWindow(contactFormWindow);
            }, 300);
        });
    }

    // --- Contact Form Submission Logic (Consolidated) ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            console.log('Form Submitted!');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Message:', message);

            alert('Thank you for your message, ' + name + '! I will get back to you soon.');

            contactForm.reset();
            contactFormWindow.classList.add('fade-hidden');
        });
    }


    // Projects Window Folder Navigation AND Dentsu Image Folder Navigation
    const projectsFolders = projectsWindow.querySelectorAll('.folder');
    const dentsuImageFolders = dentsuReflectionPopup.querySelectorAll('.dentsu-image-icon');
    // Get the Bhim UPI folder specifically from the RBI popup
    const rbiBhimUpiFolder = rbiPopup ? rbiPopup.querySelector('.folder[data-project-type="bhim-upi"]') : null;


    // Combine all relevant folders/icons for click handling
    const allProjectAndDentsuFolders = [...projectsFolders, ...dentsuImageFolders];
    if (rbiBhimUpiFolder) { // Add the BHIM UPI folder only if it exists
        allProjectAndDentsuFolders.push(rbiBhimUpiFolder);
    }


    allProjectAndDentsuFolders.forEach(folder => {
        folder.addEventListener('click', (e) => {
            const projectType = e.currentTarget.dataset.projectType;
            const imageType = e.currentTarget.dataset.image;

            let targetPopup = null;

            // --- Phase 1: Handle clicks on main project folders and internal RBI folder ---
            if (projectType) {
                switch (projectType) {
                    case 'dentsu':
                        targetPopup = dentsuReflectionPopup;
                        break;
                    case 'baghcottons':
                        targetPopup = baghCottonsPopup;
                        break;
                    case 'rbi':
                        targetPopup = rbiPopup;
                        break;
                    case 'axisbank':
                        targetPopup = axisBankPopup;
                        break;
                    case 'bhim-upi':
                        targetPopup = bhimUpiPopup;
                        break;
                    default:
                        console.log(`Unhandled project type: ${projectType}`);
                        break;
                }
            }

            // If a main project window or the specific BHIM UPI image from RBI is clicked
            if (targetPopup) {
                // Determine which parent window to close (Projects or RBI)
                let parentToClose = null;
                if (projectsWindow && !projectsWindow.classList.contains('fade-hidden')) {
                    parentToClose = projectsWindow;
                } else if (rbiPopup && !rbiPopup.classList.contains('fade-hidden')) {
                    parentToClose = rbiPopup;
                } else if (dentsuReflectionPopup && !dentsuReflectionPopup.classList.contains('fade-hidden')) {
                    parentToClose = dentsuReflectionPopup;
                }

                if (parentToClose) {
                    parentToClose.classList.add('fade-hidden');
                }

                setTimeout(() => {
                    openWindow(targetPopup);
                }, 300); // Small delay for smooth transition
                return;
            }


            // --- Phase 2: Handle clicks on Dentsu image icons (kept separate for clarity) ---
            if (imageType) {
                switch (imageType) {
                    case 'creative':
                        targetPopup = marutiCelerioPopup;
                        break;
                    case 'arcade':
                        targetPopup = marutiArcadePopup;
                        break;
                    case 'fronx':
                        targetPopup = marutiFronxPopup;
                        break;
                    default:
                        console.log(`Unhandled Dentsu image type: ${imageType}`);
                        return;
                }

                if (targetPopup) {
                    // Close the Dentsu Reflection Popup if it's open
                    if (dentsuReflectionPopup && !dentsuReflectionPopup.classList.contains('fade-hidden')) {
                        dentsuReflectionPopup.classList.add('fade-hidden');
                    }
                    // Close the main Projects Window if it's somehow still open (unlikely but good for robustness)
                    if (projectsWindow && !projectsWindow.classList.contains('fade-hidden')) {
                        projectsWindow.classList.add('fade-hidden');
                    }

                    setTimeout(() => {
                        openWindow(targetPopup);
                    }, 300);
                }
            }
        });
    });


    // --- Socials Window Dino Game Logic ---
    let score = 0;
    let gameInterval;
    let blockInterval;
    let isJumping = false;
    let isGameOver = false;
    let gameStarted = false;
    const jumpForce = 12;
    const gravity = 0.5;
    let verticalVelocity = 0;

    const scoreToWin = 30;
    let blockSpeed = 6;

    function startGame() {
        if (gameStarted) return;
        gameStarted = true;
        isGameOver = false;
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        introScreen.classList.add('fade-hidden');
        gameOverScreen.classList.add('fade-hidden');
        socialLinksContainer.classList.add('fade-hidden');

        character.style.bottom = '0px';
        block.style.right = '-30px';
        character.style.transition = 'none';

        clearInterval(gameInterval);
        clearInterval(blockInterval);

        gameInterval = setInterval(updateGame, 20);
        blockInterval = setInterval(moveBlock, 5);
    }

    function resetGame() {
        clearInterval(gameInterval);
        clearInterval(blockInterval);
        gameStarted = false;
        isGameOver = false;
        isJumping = false;
        verticalVelocity = 0;
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        character.style.bottom = '0px';
        block.style.right = '-30px';
        character.style.transition = 'none';
        blockSpeed = 6;

        introScreen.classList.remove('fade-hidden');
        gameOverScreen.classList.add('fade-hidden');
        socialLinksContainer.classList.add('fade-hidden');
    }

    function jump() {
        if (isJumping || isGameOver) return;
        isJumping = true;
        verticalVelocity = jumpForce;
        character.style.transition = 'none';
    }

    function moveBlock() {
        if (isGameOver) return;

        let currentRight = parseInt(block.style.right || 0);
        currentRight += blockSpeed;
        block.style.right = currentRight + 'px';

        const gameContainerWidth = gameContainer.offsetWidth;
        const blockWidth = block.offsetWidth;

        if (currentRight > gameContainerWidth + blockWidth) {
            block.style.right = -blockWidth + 'px';
            score += 10;
            scoreDisplay.textContent = 'Score: ' + score;

            if (score > 0 && score % 50 === 0 && blockSpeed < 20) {
                blockSpeed += 1;
                console.log(`Cactus speed increased to: ${blockSpeed}`);
            }

            if (score >= scoreToWin) {
                winGame();
            }
        }
    }

    function updateGame() {
        if (isGameOver) return;

        if (isJumping) {
            verticalVelocity -= gravity;
            let currentBottom = parseInt(character.style.bottom);
            let newBottom = currentBottom + verticalVelocity;

            if (newBottom <= 0) {
                newBottom = 0;
                isJumping = false;
                verticalVelocity = 0;
            }
            character.style.bottom = newBottom + 'px';
        }

        // Collision detection logic
        const characterRect = character.getBoundingClientRect();
        const blockRect = block.getBoundingClientRect();

        // Check for horizontal overlap
        const horizontalOverlap = characterRect.left < blockRect.right && characterRect.right > blockRect.left;

        // Check for vertical overlap (character's feet are at or below the block's top)
        // A small tolerance (e.g., 5px) can be added to the character's bottom
        const verticalOverlap = characterRect.bottom > blockRect.top + 5; // Adjusted for better jump detection

        if (horizontalOverlap && verticalOverlap) {
            gameOver();
        }
    }

    function gameOver() {
        isGameOver = true;
        gameStarted = false;
        clearInterval(gameInterval);
        clearInterval(blockInterval);
        gameOverMessage.textContent = `Game Over! You scored: ${score} points.`;
        gameOverScreen.classList.remove('fade-hidden');
    }

    function winGame() {
        isGameOver = true;
        gameStarted = false;
        clearInterval(gameInterval);
        clearInterval(blockInterval);
        gameOverMessage.textContent = `You won! You scored ${score} points!`;
        gameOverScreen.classList.remove('fade-hidden');
        restartButton.textContent = 'Play Again?';
        socialLinksContainer.classList.remove('fade-hidden');
    }

    // Event listener for keyboard input (Spacebar for jump/start)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !socialsWindow.classList.contains('fade-hidden')) {
            e.preventDefault();
            if (!gameStarted && !isGameOver) {
                startGame();
            } else if (gameStarted) {
                jump();
            }
        }
    });

    // Event listeners for game control buttons
    restartButton.addEventListener('click', resetGame);

    skipGame.addEventListener('click', (e) => {
        e.preventDefault();
        isGameOver = true;
        gameStarted = false;
        clearInterval(gameInterval);
        clearInterval(blockInterval);
        gameOverScreen.classList.add('fade-hidden');
        introScreen.classList.add('fade-hidden');
        socialLinksContainer.classList.remove('fade-hidden');
    });

    skipGameIntro.addEventListener('click', (e) => {
        e.preventDefault();
        isGameOver = true;
        gameStarted = false;
        clearInterval(gameInterval);
        clearInterval(blockInterval);
        introScreen.classList.add('fade-hidden');
        gameOverScreen.classList.add('fade-hidden');
        socialLinksContainer.classList.remove('fade-hidden');
       });
});