document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const redButton = document.getElementById('redButton');
    const scene1 = document.getElementById('scene1');
    const scene2 = document.getElementById('scene2');
    const ledScreenOverlay = document.querySelector('.led-screen-overlay');
    const desktopIcons = document.querySelector('.desktop-icons');
    const bootSound = document.getElementById('bootSound');
    const backButton = document.getElementById('monitorBackButton');
    const instructionBox = document.getElementById('instructionBox');
    const sceneOneInteractiveArea = document.querySelector('.scene-one-interactive-area');

    const projectsWindow = document.getElementById('projectsWindow');
    const socialsWindow = document.getElementById('socialsWindow');
    const contactIntroPopup = document.getElementById('contactIntroPopup');
    const contactFormWindow = document.getElementById('contactFormWindow'); // This should be the ID of your window container for the form
    const knowMeWindow = document.getElementById('knowMeWindow');
    const marutiCelerioPopup = document.getElementById('marutiCelerioPopup');
    const marutiArcadePopup = document.getElementById('marutiArcadePopup');
    const marutiFronxPopup = document.getElementById('marutiFronxPopup');
    const bhimUpiPopup = document.getElementById('bhimUpiPopup');

    const projectsIcon = document.querySelector('.projects-icon');
    const socialsIcon = document.querySelector('.socials-icon');
    const contactIcon = document.querySelector('.contact-icon');
    const knowMeIcon = document.querySelector('.know-me-icon');

    const rbiPopup = document.getElementById('rbiPopup');
    const baghCottonsPopup = document.getElementById('baghCottonsPopup');
    const axisBankPopup = document.getElementById('axisBankPopup');
    const dentsuReflectionPopup = document.getElementById('dentsuReflectionPopup');

    const proceedToContactFormButton = document.getElementById('proceedToContactForm');
    const contactForm = document.getElementById('contactForm'); // This is the form element itself

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

    let zIndexCounter = 100;
    let instructionBoxTimeoutId;

    // --- Helper Functions ---
    const allWindows = document.querySelectorAll('.window');
    allWindows.forEach(win => win.classList.add('fade-hidden'));

    const imageUrlsToPreload = [
        'images/scene1.jpg', 'images/scene2.jpg', 'images/dino.png',
        'images/cactus1.png', 'images/amisha.png', 'images/camera.png'
    ];
    imageUrlsToPreload.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    function closeAllOpenWindows() {
        document.querySelectorAll('.window:not(.fade-hidden)').forEach(window => {
            window.classList.add('fade-hidden');
            window.classList.remove('active');
            if (window.id === 'socialsWindow') {
                resetGame(); // Ensure game resets when socials window is closed
            }
            if (window.id === 'knowMeWindow') {
                const amishaRevealImg = document.getElementById('amishaRevealImg');
                if (amishaRevealImg) {
                    amishaRevealImg.classList.remove('visible');
                }
            }
        });
        document.querySelectorAll('.popup-image-full').forEach(img => {
            img.classList.add('fade-hidden');
            img.classList.remove('active');
        });
    }

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

    function openWindow(windowElement) {
        if (!windowElement) {
            console.error("Attempted to open a null or undefined windowElement.");
            return;
        }
        closeAllOpenWindows();
        windowElement.classList.remove('fade-hidden');
        windowElement.classList.add('active');
        windowElement.style.zIndex = ++zIndexCounter;

        if (windowElement === knowMeWindow) {
            const amishaRevealImg = document.getElementById('amishaRevealImg');
            if (amishaRevealImg) {
                amishaRevealImg.classList.remove('visible');
                setTimeout(() => {
                    amishaRevealImg.classList.add('visible');
                }, 100);
            }
        }
    }

    // --- Apply Window Controls to All Windows ---
    if (projectsWindow) setupWindowControls(projectsWindow);
    if (socialsWindow) setupWindowControls(socialsWindow);
    const contactFormWindowElement = document.getElementById('contactFormWindow');
    if (contactFormWindowElement) setupWindowControls(contactFormWindowElement);
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
        instructionBox.classList.add('fade-hidden');
        instructionBoxTimeoutId = setTimeout(() => {
            instructionBox.style.display = 'block';
            requestAnimationFrame(() => {
                instructionBox.classList.remove('fade-hidden');
                instructionBox.classList.add('fade-visible');
            });
        }, 5000);
    }

    // Boot Up Sequence
    redButton.addEventListener('click', () => {
        if (instructionBox) {
            if (instructionBoxTimeoutId) {
                clearTimeout(instructionBoxTimeoutId);
                instructionBoxTimeoutId = null;
                instructionBox.style.display = 'none';
                instructionBox.classList.remove('fade-visible');
                instructionBox.classList.add('fade-hidden');
            } else {
                instructionBox.classList.remove('fade-visible');
                instructionBox.classList.add('fade-hidden');

                function handleInstructionBoxTransitionEnd(event) {
                    if (event.propertyName === 'opacity' && instructionBox.classList.contains('fade-hidden')) {
                        instructionBox.style.display = 'none';
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
        sceneOneInteractiveArea.classList.add('zooming');

        setTimeout(() => {
            sceneOneInteractiveArea.style.display = 'none';
            sceneOneInteractiveArea.classList.remove('zooming', 'active');
            scene1.classList.remove('active');
            scene1.style.display = 'none';

            scene2.style.display = 'block';
            scene2.classList.add('active');

            ledScreenOverlay.style.display = 'block';
            desktopIcons.style.display = 'flex';
            backButton.style.display = 'block';

            ledScreenOverlay.classList.remove('fade-hidden');
            desktopIcons.classList.remove('fade-hidden');
            backButton.classList.remove('fade-hidden');
        }, 1500);
    });

    // Monitor Back Button Event Listener
    if (backButton) {
        backButton.addEventListener('click', () => {
            closeAllOpenWindows();

            desktopIcons.classList.add('fade-hidden');
            ledScreenOverlay.classList.add('fade-hidden');
            backButton.classList.add('fade-hidden');

            desktopIcons.style.display = 'none';
            ledScreenOverlay.style.display = 'none';
            backButton.style.display = 'none';

            scene2.style.display = 'none';
            scene2.classList.remove('active');

            sceneOneInteractiveArea.style.display = 'block';
            sceneOneInteractiveArea.classList.add('active');
            sceneOneInteractiveArea.classList.remove('zooming');
            sceneOneInteractiveArea.classList.add('zooming-out');

            scene1.style.display = 'block';
            scene1.classList.add('active');

            if (bootSound) {
                bootSound.currentTime = 0;
                bootSound.play();
            }

            setTimeout(() => {
                sceneOneInteractiveArea.classList.remove('zooming-out');
                redButton.classList.remove('fade-hidden');
            }, 1700);
        });
    } else {
        console.error("Error: The 'monitorBackButton' element was not found.");
    }

    // Desktop Icon Clicks
    projectsIcon.addEventListener('click', () => {
        openWindow(projectsWindow);
    });

    // Socials Icon Click - Wait for TransitionEnd
    socialsIcon.addEventListener('click', () => {
        openWindow(socialsWindow);

        const handleSocialsWindowTransitionEnd = (event) => {
            if (event.propertyName === 'opacity' && socialsWindow.classList.contains('active')) {
                socialsWindow.removeEventListener('transitionend', handleSocialsWindowTransitionEnd);
                console.log("Socials Window transition ended. Resetting game.");
                resetGame();
            }
        };

        socialsWindow.addEventListener('transitionend', handleSocialsWindowTransitionEnd);

        // Fallback timeout in case transitionend doesn't fire reliably
        setTimeout(() => {
            if (!gameStarted && !socialsWindow.classList.contains('fade-hidden')) {
                console.warn("TransitionEnd fallback triggered. Resetting game.");
                socialsWindow.removeEventListener('transitionend', handleSocialsWindowTransitionEnd);
                resetGame();
            }
        }, 700); // This timeout should be slightly longer than your CSS transition duration
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
                const actualContactFormWindow = document.getElementById('contactFormWindow');
                if (actualContactFormWindow) {
                    openWindow(actualContactFormWindow);
                } else {
                    console.error("Contact Form Window element not found with ID 'contactFormWindow'");
                }
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
            const actualContactFormWindow = document.getElementById('contactFormWindow');
            if (actualContactFormWindow) {
                actualContactFormWindow.classList.add('fade-hidden');
            }
        });
    }

    // Projects Window Folder Navigation AND Dentsu Image Folder Navigation
    const projectsFolders = projectsWindow.querySelectorAll('.folder');
    const dentsuImageFolders = dentsuReflectionPopup.querySelectorAll('.dentsu-image-icon');
    const rbiBhimUpiFolder = rbiPopup ? rbiPopup.querySelector('.folder[data-project-type="bhim-upi"]') : null;

    const allProjectAndDentsuFolders = [...projectsFolders, ...dentsuImageFolders];
    if (rbiBhimUpiFolder) {
        allProjectAndDentsuFolders.push(rbiBhimUpiFolder);
    }

    allProjectAndDentsuFolders.forEach(folder => {
        folder.addEventListener('click', (e) => {
            const projectType = e.currentTarget.dataset.projectType;
            const imageType = e.currentTarget.dataset.image;

            let targetPopup = null;

            if (projectType) {
                switch (projectType) {
                    case 'dentsu': targetPopup = dentsuReflectionPopup; break;
                    case 'baghcottons': targetPopup = baghCottonsPopup; break;
                    case 'rbi': targetPopup = rbiPopup; break;
                    case 'axisbank': targetPopup = axisBankPopup; break;
                    case 'bhim-upi': targetPopup = bhimUpiPopup; break;
                    default: console.log(`Unhandled project type: ${projectType}`); break;
                }
            }

            if (targetPopup) {
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
                }, 300);
                return;
            }

            if (imageType) {
                switch (imageType) {
                    case 'creative': targetPopup = marutiCelerioPopup; break;
                    case 'arcade': targetPopup = marutiArcadePopup; break;
                    case 'fronx': targetPopup = marutiFronxPopup; break;
                    default: console.log(`Unhandled Dentsu image type: ${imageType}`); return;
                }

                if (targetPopup) {
                    if (dentsuReflectionPopup && !dentsuReflectionPopup.classList.contains('fade-hidden')) {
                        dentsuReflectionPopup.classList.add('fade-hidden');
                    }
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


    // --- Socials Window Dino Game Logic (Frame-rate independent) ---
    let score = 0;
    let isJumping = false;
    let isGameOver = false;
    let gameStarted = false;
    let verticalVelocity = 0; // Current vertical speed in pixels per second
    let firstCollisionCheckDelay = false; // Flag to delay the first collision check

    // Frame-rate independent timing
    let lastFrameTime = 0; // Will store the timestamp of the last frame

    // Fixed game physics values (these will not change based on window size)
    // Adjusted values for a more balanced jump arc:
    const JUMP_FORCE_BASE = 400; // Initial upward velocity in pixels per second
    const GRAVITY_ACCELERATION = 1200; // Downward acceleration in pixels per second squared
    let BLOCK_SPEED_PER_SECOND = 300; // Cactus speed in pixels per second
    const BLOCK_START_RIGHT_POSITION = -200; // Much further off-screen to the right

    // Base dimensions for the internal game logic
    const CHARACTER_WIDTH = 40;
    const CHARACTER_HEIGHT = 40;
    const BLOCK_WIDTH = 30;
    const BLOCK_HEIGHT = 40;

    const scoreToWin = 30;
    const baseGameWidth = 500;
    const baseGameHeight = 200;


    // REVISED: updateGameDimensions() - now applies CSS scale to the gameContainer
    function updateGameDimensions() {
        const currentContainerWidth = gameContainer.offsetWidth;
        const currentContainerHeight = gameContainer.offsetHeight;

        if (currentContainerWidth === 0 || currentContainerHeight === 0) {
            console.warn("Game container has zero dimensions. Cannot apply scale.");
            // Set base dimensions if container is invisible, so elements still have size
            character.style.width = `${CHARACTER_WIDTH}px`;
            character.style.height = `${CHARACTER_HEIGHT}px`;
            block.style.width = `${BLOCK_WIDTH}px`;
            block.style.height = `${BLOCK_HEIGHT}px`;
            return false;
        }

        const scale = Math.min(currentContainerWidth / baseGameWidth, currentContainerHeight / baseGameHeight);

        gameContainer.style.transform = `scale(${scale})`;
        gameContainer.style.transformOrigin = 'center';

        console.log(`updateGameDimensions called. Container width: ${currentContainerWidth}, Scale applied: ${scale.toFixed(2)}`);
        return true;
    }


    function startGame() {
        if (gameStarted) return;

        if (!updateGameDimensions()) {
            console.error("Game container not ready. Cannot start game.");
            return;
        }

        gameStarted = true;
        isGameOver = false;
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        introScreen.classList.add('fade-hidden');
        gameOverScreen.classList.add('fade-hidden');
        socialLinksContainer.classList.add('fade-hidden');

        character.style.bottom = `0px`;
        block.style.right = `${BLOCK_START_RIGHT_POSITION}px`;
        
        character.style.width = `${CHARACTER_WIDTH}px`;
        character.style.height = `${CHARACTER_HEIGHT}px`;
        block.style.width = `${BLOCK_WIDTH}px`;
        block.style.height = `${BLOCK_HEIGHT}px`;

        character.style.transition = 'none';

        BLOCK_SPEED_PER_SECOND = 300; // Ensure this is reset to the initial speed

        firstCollisionCheckDelay = true;
        setTimeout(() => {
            firstCollisionCheckDelay = false;
            console.log("Collision check enabled.");
        }, 200);

        lastFrameTime = performance.now(); // Initialize lastFrameTime for the first loop
        requestAnimationFrame(gameLoop); // Start the main game loop
        console.log("Game started. Initial BLOCK_SPEED_PER_SECOND:", BLOCK_SPEED_PER_SECOND, "Block initial right:", block.style.right);
    }

    function resetGame() {
        console.log("Resetting game...");
        gameStarted = false; // This stops the gameLoop
        isGameOver = false;
        isJumping = false;
        verticalVelocity = 0;
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        
        BLOCK_SPEED_PER_SECOND = 300; // Reset speed
        
        updateGameDimensions();

        character.style.bottom = `0px`;
        block.style.right = `${BLOCK_START_RIGHT_POSITION}px`;
        
        character.style.width = `${CHARACTER_WIDTH}px`;
        character.style.height = `${CHARACTER_HEIGHT}px`;
        block.style.width = `${BLOCK_WIDTH}px`;
        block.style.height = `${BLOCK_HEIGHT}px`;

        character.style.transition = 'none';

        firstCollisionCheckDelay = true;
        setTimeout(() => {
            firstCollisionCheckDelay = false;
            console.log("Collision check enabled after reset.");
        }, 200);
        
        introScreen.classList.remove('fade-hidden');
        gameOverScreen.classList.add('fade-hidden');
        socialLinksContainer.classList.add('fade-hidden');
        console.log("Game reset. BLOCK_SPEED_PER_SECOND reset to:", BLOCK_SPEED_PER_SECOND, "Block initial right:", block.style.right);
    }

    // *** NEW: Main game loop using requestAnimationFrame ***
    function gameLoop(currentTime) {
        if (!gameStarted || isGameOver) {
            return; // Stop the loop if game is not started or is over
        }

        const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert ms to seconds
        lastFrameTime = currentTime;

        updateGame(deltaTime); // Pass deltaTime to updateGame
        moveBlock(deltaTime); // Pass deltaTime to moveBlock

        requestAnimationFrame(gameLoop); // Request next frame
    }

    function jump() { // No deltaTime needed here, as it sets initial velocity
        if (isJumping || isGameOver) return;
        isJumping = true;
        verticalVelocity = JUMP_FORCE_BASE; // Set initial upward velocity
        character.style.transition = 'none';
    }

    // *** MODIFIED: Takes deltaTime as argument ***
    function moveBlock(deltaTime) {
        if (isGameOver) return;

        let currentRight = parseFloat(block.style.right || 0);
        // Calculate movement based on speed PER SECOND and actual time elapsed
        currentRight += BLOCK_SPEED_PER_SECOND * deltaTime;
        block.style.right = currentRight + 'px';

        if (currentRight > baseGameWidth + BLOCK_WIDTH) {
            block.style.right = `${BLOCK_START_RIGHT_POSITION - Math.random() * (baseGameWidth / 4)}px`;
            score += 10;
            scoreDisplay.textContent = 'Score: ' + score;

            if (score > 0 && score % 50 === 0) {
                const MAX_BLOCK_SPEED_PER_SECOND = 700; // Adjust as needed
                console.log(`Current BLOCK_SPEED_PER_SECOND before increase: ${BLOCK_SPEED_PER_SECOND}`);
                if (BLOCK_SPEED_PER_SECOND < MAX_BLOCK_SPEED_PER_SECOND) {
                    BLOCK_SPEED_PER_SECOND += 50; // Increase speed by 50 pixels/second
                    console.log(`Cactus speed increased to: ${BLOCK_SPEED_PER_SECOND}`);
                } else {
                    console.log(`Max cactus speed (${MAX_BLOCK_SPEED_PER_SECOND}) reached.`);
                }
            }

            if (score >= scoreToWin) {
                winGame();
            }
        }
    }

    // *** MODIFIED: Takes deltaTime as argument ***
    function updateGame(deltaTime) {
        if (isGameOver) return;

        if (firstCollisionCheckDelay) {
            return;
        }

        if (isJumping) {
            // Apply gravity (acceleration) to verticalVelocity
            verticalVelocity -= GRAVITY_ACCELERATION * deltaTime; // verticalVelocity is pixels/sec

            let currentBottom = parseFloat(character.style.bottom);
            // Apply current verticalVelocity (pixels/sec) over deltaTime (seconds) to get pixel change
            let newBottom = currentBottom + verticalVelocity * deltaTime; 


            if (newBottom <= 0) {
                newBottom = 0;
                isJumping = false;
                verticalVelocity = 0;
            }
            character.style.bottom = newBottom + 'px';
        }

        const characterRect = character.getBoundingClientRect();
        const blockRect = block.getBoundingClientRect();

        const horizontalOverlap = characterRect.left < blockRect.right && characterRect.right > blockRect.left;
        const verticalOverlap = characterRect.bottom > blockRect.top + 5; 

        if (horizontalOverlap && verticalOverlap) {
            console.log("Collision detected!");
            gameOver();
        }
    }

    function gameOver() {
        isGameOver = true;
        gameStarted = false; // This will stop the gameLoop
        gameOverMessage.textContent = `Game Over! You scored: ${score} points.`;
        gameOverScreen.classList.remove('fade-hidden');
        console.log("Game Over!");
    }

    function winGame() {
        isGameOver = true;
        gameStarted = false; // This will stop the gameLoop
        gameOverMessage.textContent = `You won! You scored ${score} points!`;
        gameOverScreen.classList.remove('fade-hidden');
        restartButton.textContent = 'Play Again?';
        socialLinksContainer.classList.remove('fade-hidden');
        console.log("Game Won!");
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !socialsWindow.classList.contains('fade-hidden')) {
            e.preventDefault();
            if (!gameStarted && !isGameOver) {
                startGame();
            } else if (gameStarted) {
                jump(); // Jump doesn't need deltaTime here as it just sets initial velocity
            }
        }
    });

    restartButton.addEventListener('click', resetGame);

    skipGame.addEventListener('click', (e) => {
        e.preventDefault();
        isGameOver = true;
        gameStarted = false;
        gameOverScreen.classList.add('fade-hidden');
        introScreen.classList.add('fade-hidden');
        socialLinksContainer.classList.remove('fade-hidden');
    });

    skipGameIntro.addEventListener('click', (e) => {
        e.preventDefault();
        isGameOver = true;
        gameStarted = false;
        introScreen.classList.add('fade-hidden');
        gameOverScreen.classList.add('fade-hidden');
        socialLinksContainer.classList.remove('fade-hidden');
    });

    // Window resize listener for Dino game responsiveness
    window.addEventListener('resize', () => {
        if (!socialsWindow.classList.contains('fade-hidden') || gameStarted) {
            console.log("Window resized. Updating game dimensions.");
            updateGameDimensions();
        }
    });

    // Initial call to set the correct scale for the game container
    // This runs when the page first loads.
    updateGameDimensions();
});