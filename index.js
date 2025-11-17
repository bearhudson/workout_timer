const express = require('express');
const app = express();
const PORT = 3000;

// --- HTML Content with Embedded JavaScript (Single File Client Logic) ---
const workoutHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upper Body Calisthenics Workout Timer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            transition: background-color 0.5s;
        }
        /* Custom scrollbar for better aesthetics */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 10px; }
        ::-webkit-scrollbar-track { background: #e5e7eb; }
        .rest-bg {
            background-color: #ef4444; /* Red for Rest */
            color: white;
        }
        .work-bg {
            background-color: #10b981; /* Green for Work */
            color: white;
        }
        .text-shadow-custom {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
        }
        .step-item {
            background-color: #f3f4f6; /* Default gray background */
            color: #4b5563; /* Default text color */
        }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center p-4">

    <div id="app" class="w-full max-w-lg bg-white shadow-2xl rounded-xl p-6 md:p-8 mt-4">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-6 text-center">Calisthenics Timer</h1>
        
        <!-- Status Display -->
        <div class="mb-6 p-4 rounded-lg bg-indigo-100 text-indigo-800 font-semibold text-center">
            <span id="current-cycle"></span>
        </div>

        <!-- Timer/Instruction Area -->
        <div id="content-area" class="flex flex-col items-center justify-center">

            <!-- Initial Screen -->
            <div id="initial-screen">
                <h2 class="text-2xl font-bold mb-3 text-gray-700 text-center">Ready to Start?</h2>
                <p class="text-gray-500 mb-6 text-center">Hit 'Start Workout' to begin the full **Warm-up and Mobility** routine!</p>
                <button id="start-button" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-200 shadow-md">
                    Start Workout
                </button>
            </div>

            <!-- Workout Screen -->
            <div id="workout-screen" class="hidden w-full">
                <p id="current-instruction" class="text-xl font-bold mb-3 text-center transition duration-500 transform scale-100"></p>
                
                <div id="timer-display" class="text-7xl font-extrabold mb-4 py-8 rounded-xl shadow-inner text-center text-shadow-custom transition duration-500 ease-in-out">
                    --:--
                </div>
                
                <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="text-sm font-medium text-gray-500">Notes:</p>
                    <p id="exercise-notes" class="text-base text-gray-700 mt-1"></p>
                </div>
                
                <button id="action-button" class="w-full py-3 font-bold rounded-lg transition duration-200 shadow-xl focus:outline-none focus:ring-4">
                    Done with Reps / Skip Rest
                </button>
            </div>

            <!-- Full Routine List Display -->
            <div class="mt-8 w-full">
                <h3 class="text-xl font-bold text-gray-800 mb-3 border-b pb-1">Full Workout Sequence (Progress Tracker)</h3>
                <div id="routine-list-container" class="max-h-80 overflow-y-auto pr-2">

                    <!-- WARMUP -->
                    <div id="ts-w" class="routine-section p-3 rounded-xl mb-3 bg-green-50 border border-green-200 transition-all duration-300">
                        <p class="font-extrabold text-green-800 mb-2">I. WARM-UP & MOBILITY (2 Sets)</p>
                        <div id="step-W0" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Banded Shoulder Pass-Throughs (Set 1)</div>
                        <div id="step-W1" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Banded Pull-Aparts (Set 1)</div>
                        <div id="step-W2" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">T-Spine/Thoracic Rotations (Set 1)</div>
                        <div id="step-W3" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Dead Hang (Pull-Up Bar) (Set 1)</div>
                        <div id="step-W4" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Scapular Pull-Ups (Set 1)</div>
                        <div id="step-W5" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Elbow & Wrist Circles</div>

                        <div id="step-W6" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300 mt-2">Banded Shoulder Pass-Throughs (Set 2)</div>
                        <div id="step-W7" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Banded Pull-Aparts (Set 2)</div>
                        <div id="step-W8" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">T-Spine/Thoracic Rotations (Set 2)</div>
                        <div id="step-W9" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Dead Hang (Pull-Up Bar) (Set 2)</div>
                        <div id="step-W10" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Scapular Pull-Ups (Set 2)</div>
                        <div id="step-W11" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300 font-bold text-green-700">Warm-up Complete - Start Tri-Set A</div>
                    </div>

                    <!-- TRI-SET A -->
                    <div id="ts-a" class="routine-section p-3 rounded-xl mb-3 bg-indigo-50 border border-indigo-200 transition-all duration-300">
                        <p class="font-extrabold text-indigo-800 mb-2">II. TRI-SET A (Vertical Pull & Push - 3 Rounds)</p>
                        <div id="step-A1" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Pull-Ups (Neutral/Overhand Grip)</div>
                        <div id="step-A2" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Dips (Pectoral Focus)</div>
                        <div id="step-A3" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Banded Face Pulls</div>
                    </div>
                    
                    <!-- QUAD-SET B -->
                    <div id="ts-b" class="routine-section p-3 rounded-xl mb-3 bg-indigo-50 border border-indigo-200 transition-all duration-300">
                        <p class="font-extrabold text-indigo-800 mb-2">III. QUAD-SET B (Horizontal Pull, Push & Arms - 3 Rounds)</p>
                        <div id="step-B1" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Dip Station Inverted Rows</div>
                        <div id="step-B2" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Banded Overhead Triceps Extension</div>
                        <div id="step-B3" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Banded Bicep Curls</div>
                        <!-- NEW PUSH-UP STEP ADDED HERE -->
                        <div id="step-B4" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Push-ups (Standard)</div>
                    </div>

                    <!-- CORE CRUNCH -->
                    <div id="ts-c" class="routine-section p-3 rounded-xl mb-3 bg-indigo-50 border border-indigo-200 transition-all duration-300">
                        <p class="font-extrabold text-indigo-800 mb-2">IV. CORE CRUNCH & FINISHER (3 Rounds)</p>
                        <div id="step-C1" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Hanging Knee/Leg Raises</div>
                        <div id="step-C2" class="step-item p-2 my-1 rounded-lg text-sm transition-all duration-300">Dip Station Reverse Shrugs</div>
                    </div>
                </div>
            </div>

            <!-- Final Screen -->
            <div id="completion-screen" class="hidden mt-8">
                <h2 class="text-3xl font-bold text-green-600 mb-4 text-center">💪 Workout Complete!</h2>
                <p class="text-gray-700 mb-6 text-center">Great job! Don't forget to complete the 5-minute cool-down and stretching phase (Section IV) for recovery.</p>
            </div>
        </div>

    </div>

    <script>
        // --- Workout Data ---
        
        // WARMUP STEPS (12 steps total, no rest between them)
        const WARMUP_STEPS = [
            { name: "Banded Shoulder Pass-Throughs", type: "Warmup", sets: 2, setNum: 1, duration: 0, notes: "10 Reps", stepId: "W0" },
            { name: "Banded Pull-Aparts", type: "Warmup", sets: 2, setNum: 1, duration: 0, notes: "15 Reps", stepId: "W1" },
            { name: "T-Spine/Thoracic Rotations", type: "Warmup", sets: 2, setNum: 1, duration: 0, notes: "8 Reps per side", stepId: "W2" },
            { name: "Dead Hang (Pull-Up Bar)", type: "Warmup", sets: 2, setNum: 1, duration: 20, notes: "20 Seconds", stepId: "W3" },
            { name: "Scapular Pull-Ups", type: "Warmup", sets: 2, setNum: 1, duration: 0, notes: "10 Reps", stepId: "W4" },
            { name: "Elbow & Wrist Circles", type: "Warmup", sets: 1, setNum: 1, duration: 30, notes: "30 Seconds each direction", stepId: "W5" },
            
            // Set 2 of the 5 main warm-up moves
            { name: "Banded Shoulder Pass-Throughs", type: "Warmup", sets: 2, setNum: 2, duration: 0, notes: "10 Reps", stepId: "W6" },
            { name: "Banded Pull-Aparts", type: "Warmup", sets: 2, setNum: 2, duration: 0, notes: "15 Reps", stepId: "W7" },
            { name: "T-Spine/Thoracic Rotations", type: "Warmup", sets: 2, setNum: 2, duration: 0, notes: "8 Reps per side", stepId: "W8" },
            { name: "Dead Hang (Pull-Up Bar)", type: "Warmup", sets: 2, setNum: 2, duration: 20, notes: "20 Seconds", stepId: "W9" },
            { name: "Scapular Pull-Ups", type: "Warmup", sets: 2, setNum: 2, duration: 0, notes: "10 Reps", stepId: "W10" },
            { name: "Warm-up Complete", type: "Warmup", sets: 1, setNum: 1, duration: 0, notes: "Ready for Tri-Set A", stepId: "W11" },
        ];

        // MAIN WORKOUT STEPS (A: 6 steps, B: 8 steps, C: 4 steps = 18 total steps)
        const MAIN_WORKOUT_STEPS = [
            // Tri-Set A (6 steps)
            { name: "Pull-Ups (Neutral/Overhand Grip)", type: "Work", duration: 0, sets: 3, notes: "Max Reps (-1)", stepId: "A1" },
            { name: "Rest", type: "Rest", duration: 15, sets: 3 },
            { name: "Dips (Pectoral Focus)", type: "Work", duration: 0, sets: 3, notes: "Max Reps (-1)", stepId: "A2" },
            { name: "Rest", type: "Rest", duration: 15, sets: 3 },
            { name: "Banded Face Pulls", type: "Work", duration: 0, sets: 3, notes: "15-20 Reps", stepId: "A3" },
            { name: "Rest", type: "Rest", duration: 75, sets: 3, isLongRest: true, instruction: "Rest between Tri-Sets (A)" }, 

            // QUAD-Set B (8 steps)
            { name: "Dip Station Inverted Rows", type: "Work", duration: 0, sets: 3, notes: "10-15 Reps", stepId: "B1" },
            { name: "Rest", type: "Rest", duration: 15, sets: 3 },
            { name: "Banded Overhead Triceps Extension", type: "Work", duration: 0, sets: 3, notes: "12-15 Reps", stepId: "B2" },
            { name: "Rest", type: "Rest", duration: 15, sets: 3 },
            { name: "Banded Bicep Curls", type: "Work", duration: 0, sets: 3, notes: "12-15 Reps", stepId: "B3" },
            { name: "Rest", type: "Rest", duration: 15, sets: 3 }, // SHORT REST AFTER B3
            { name: "Push-ups (Standard)", type: "Work", duration: 0, sets: 3, notes: "Max Reps (-1)", stepId: "B4" }, // PUSH-UPS
            { name: "Rest", type: "Rest", duration: 75, sets: 3, isLongRest: true, instruction: "Rest before Core Work" }, 

            // Core Crunch (4 steps)
            { name: "Hanging Knee/Leg Raises", type: "Work", duration: 0, sets: 3, notes: "10-15 Reps", stepId: "C1" },
            { name: "Rest", type: "Rest", duration: 10, sets: 3 },
            { name: "Dip Station Reverse Shrugs", type: "Work", duration: 0, sets: 3, notes: "15 Reps", stepId: "C2" },
            { name: "Rest", type: "Rest", duration: 60, sets: 3, isLongRest: true, instruction: "Final Rest" }, 
        ];
        
        const WORKOUT_PLAN = WARMUP_STEPS.concat(MAIN_WORKOUT_STEPS);


        // --- State Variables ---
        let currentStepIndex = 0;
        let currentSet = 1;
        let timer = null;
        let timeLeft = 0;
        let isRunning = false;
        
        // --- DOM Elements ---
        const app = document.getElementById('app');
        const startButton = document.getElementById('start-button');
        const workoutScreen = document.getElementById('workout-screen');
        const initialScreen = document.getElementById('initial-screen');
        const completionScreen = document.getElementById('completion-screen');
        const currentInstruction = document.getElementById('current-instruction');
        const timerDisplay = document.getElementById('timer-display');
        const exerciseNotes = document.getElementById('exercise-notes');
        const actionButton = document.getElementById('action-button');
        const currentCycleDisplay = document.getElementById('current-cycle');

        // --- Core Functions ---
        
        function updateRoutineListHighlight() {
            // 1. Clear all highlights
            document.querySelectorAll('.step-item').forEach(el => {
                el.classList.remove('bg-yellow-300', 'font-bold', 'ring-2', 'ring-yellow-500', 'text-gray-900', 'bg-green-300');
                el.classList.add('bg-gray-100', 'text-gray-700');
            });
            document.querySelectorAll('.routine-section').forEach(el => {
                el.classList.remove('ring-4', 'ring-indigo-500', 'ring-green-500');
            });

            if (!isRunning) return;

            const step = WORKOUT_PLAN[currentStepIndex];
            // Don't highlight rest steps, just the work step before the rest
            if (!step || step.type === 'Rest') return; 

            // 2. Determine the active element ID and Section ID
            const activeId = \`step-\${step.stepId}\`;
            let sectionId = '';
            
            if (step.type === 'Warmup') {
                sectionId = 'ts-w';
            } else if (step.stepId && step.stepId.startsWith('A')) {
                sectionId = 'ts-a';
            } else if (step.stepId && step.stepId.startsWith('B')) {
                sectionId = 'ts-b';
            } else if (step.stepId && step.stepId.startsWith('C')) {
                sectionId = 'ts-c';
            }

            // 3. Apply the highlight
            const activeEl = document.getElementById(activeId);
            if (activeEl) {
                activeEl.classList.remove('bg-gray-100', 'text-gray-700');
                
                if (step.type === 'Warmup') {
                    // Use green highlight for warm-up
                    activeEl.classList.add('bg-green-300', 'font-bold', 'ring-2', 'ring-green-500', 'text-gray-900');
                } else {
                    // Use yellow highlight for main work
                    activeEl.classList.add('bg-yellow-300', 'font-bold', 'ring-2', 'ring-yellow-500', 'text-gray-900');
                }

                // Scroll the active item into view
                const container = document.getElementById('routine-list-container');
                if (container) {
                    container.scrollTop = activeEl.offsetTop - container.offsetTop - (container.offsetHeight / 2) + (activeEl.offsetHeight / 2);
                }
            }
            
            // Highlight the whole section box
            const sectionEl = document.getElementById(sectionId);
            if (sectionEl) {
                if (sectionId === 'ts-w') {
                    sectionEl.classList.add('ring-4', 'ring-green-500');
                } else {
                    sectionEl.classList.add('ring-4', 'ring-indigo-500');
                }
            }
        }

        function updateDisplay() {
            const step = WORKOUT_PLAN[currentStepIndex];
            if (!step) return;

            const isRest = step.type === 'Rest';
            const isWarmup = step.type === 'Warmup';
            
            // --- Cycle Display Logic ---
            let cycleText = "";
            
            if (isWarmup) {
                 // Calculate progress through the 12 warm-up steps
                const warmupProgress = currentStepIndex + 1;
                cycleText = \`WARM-UP | Step \${warmupProgress}/12\`;
            } else {
                // Tri-Set Logic (Starts at currentSet = 1, runs up to 9)
                let section = "";
                let totalCycles = 3;
                let cycle = 0;

                if (currentSet <= 3) {
                    section = "Tri-Set A";
                    cycle = currentSet;
                } else if (currentSet <= 6) {
                    section = "Quad-Set B";
                    cycle = currentSet - 3;
                } else {
                    section = "Core Crunch";
                    cycle = currentSet - 6;
                }
                cycleText = \`\${section} | Set \${cycle}/\${totalCycles}\`;
            }

            currentCycleDisplay.textContent = cycleText;

            // --- Style Updates ---
            app.classList.remove('rest-bg', 'work-bg', 'bg-white');
            app.classList.add(isRest ? 'rest-bg' : 'bg-white');
            document.body.className = isRest ? 'rest-bg' : 'bg-gray-100';
            
            // --- Instruction and Notes Updates ---
            if (isRest) {
                currentInstruction.textContent = step.instruction || 'REST TIME!';
                exerciseNotes.textContent = \`Get ready for your next set: \${WORKOUT_PLAN[currentStepIndex + 1]?.name || 'Next'}\`;
                timerDisplay.classList.add('work-bg');
                timerDisplay.classList.remove('text-gray-900', 'bg-gray-100');
            } else {
                let repText = (isWarmup && step.duration > 0) ? \`(\${step.duration}s Timed)\` : '';
                currentInstruction.textContent = \`\${step.name} \${repText}\`;
                exerciseNotes.textContent = step.notes;
                timerDisplay.classList.remove('work-bg');
                timerDisplay.classList.add('bg-gray-100', 'text-gray-900');
            }
            
            // --- Button Logic ---
            const isTimedStep = step.duration > 0 || isRest;

            if (isTimedStep) {
                 actionButton.textContent = isRest ? \`Skip Rest (\${timeLeft}s)\` : \`Skip Step (\${timeLeft}s)\`;
            } else {
                 actionButton.textContent = 'DONE with Reps / Start Rest';
            }

            actionButton.className = 'w-full py-3 font-bold rounded-lg transition duration-200 shadow-xl focus:outline-none focus:ring-4';
            if (isRest) {
                actionButton.classList.add('bg-white', 'text-red-500', 'hover:bg-gray-100', 'focus:ring-red-300');
            } else if (isWarmup) {
                actionButton.classList.add('bg-green-600', 'text-white', 'hover:bg-green-700', 'focus:ring-green-300');
            } else {
                actionButton.classList.add('bg-indigo-600', 'text-white', 'hover:bg-indigo-700', 'focus:ring-indigo-300');
            }
            
            // --- Timer Display ---
            const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const seconds = (timeLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = isTimedStep && !isRest ? \`\${minutes}:\${seconds}\` : (isRest ? \`\${minutes}:\${seconds}\` : 'REPS');

            // Update the routine list highlight
            if (isRunning) {
                updateRoutineListHighlight();
            }
        }
        
        function tick() {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                nextStep();
            }
        }

        function startTimer(duration) {
            timeLeft = duration;
            updateDisplay();
            timer = setInterval(tick, 1000);
        }

        function nextStep() {
            clearInterval(timer);
            const currentStep = WORKOUT_PLAN[currentStepIndex];

            // 1. Handle Rep-Based Work/Warmup Advance (Only advances index on button click)
            if (currentStep && currentStep.type !== 'Rest' && currentStep.duration === 0) {
                currentStepIndex++; 
            }
            
            // 2. Handle Timed/Rest Advance (Only advances index on tick timeout or skip button)
            else if (currentStep && (currentStep.duration > 0 || currentStep.type === 'Rest')) {
                // Advance index only if it's a short step that just completed (long rest handled below)
                if (!currentStep.isLongRest) {
                    currentStepIndex++;
                } 
                // Note: Long rests are handled in the loop logic below.
            }

            // --- Loop/Transition Logic (After index increment) ---
            
            // Check for Warm-up completion
            if (currentStepIndex === WARMUP_STEPS.length) { // Index 12
                // Warmup finished, reset index to start of Tri-Set A (Index 12, which is Pull-Ups)
                // The index is already 12, so nothing needed here, just the console message on the CLI version.
            }
            
            // Handle Long Rest (Looping/Section Transition)
            if (currentStep && currentStep.isLongRest) {
                // This logic runs only after a Long Rest is completed or skipped.
                currentSet++;

                if (currentSet > 9) { 
                    currentStepIndex = WORKOUT_PLAN.length; 
                } else if (currentStepIndex === 17) { // End of Tri-Set A Long Rest
                    currentStepIndex = (currentSet === 4) ? 18 : 12; // Start of B or Loop A
                } else if (currentStepIndex === 25) { // End of Quad-Set B Long Rest
                    currentStepIndex = (currentSet === 7) ? 26 : 18; // Start of C or Loop B
                } else if (currentStepIndex === 29) { // End of Core Crunch C Long Rest
                    currentStepIndex = 26; // Loop C
                }
            }


            // 4. Check for Completion
            if (currentStepIndex >= WORKOUT_PLAN.length || currentSet > 9) {
                finishWorkout();
                return;
            }
            
            // 5. Start timer if the next step is timed, otherwise update display for user interaction
            const nextStepData = WORKOUT_PLAN[currentStepIndex];
            
            if (nextStepData.duration > 0 || nextStepData.type === 'Rest') {
                // Auto-start timer for timed work or rest steps
                startTimer(nextStepData.duration);
            } else {
                // Display prompt for rep-based work steps
                updateDisplay();
            }
        }

        function finishWorkout() {
            isRunning = false;
            workoutScreen.classList.add('hidden');
            completionScreen.classList.remove('hidden');
            document.body.className = 'bg-gray-100'; // Reset background
            updateRoutineListHighlight(); // Clear final highlight
        }

        // --- Event Handlers ---
        
        startButton.addEventListener('click', () => {
            initialScreen.classList.add('hidden');
            workoutScreen.classList.remove('hidden');
            isRunning = true;
            currentSet = 1; 
            currentStepIndex = 0; 
            
            // Start the first step (which is rep-based)
            nextStep();
        });

        actionButton.addEventListener('click', () => {
            if (!isRunning) return;

            const step = WORKOUT_PLAN[currentStepIndex];
            
            // If it's a timed step (Work or Rest), clicking the button skips it.
            if (step.duration > 0 || step.type === 'Rest') {
                clearInterval(timer);
                
                // For long rests, we need to manually advance the index for the loop logic in nextStep to run correctly.
                if (step.isLongRest) {
                    // nextStep will handle the looping logic based on the long rest index
                    nextStep(); 
                } else {
                    // For short steps (timed work or short rest), we manually advance the index here and call nextStep.
                    currentStepIndex++;
                    nextStep();
                }
            } else {
                // If it's a rep-based step, clicking the button moves to the next step (index advanced inside nextStep).
                nextStep();
            }
        });

        // Initialize the view on load
        updateDisplay(); 
        
    </script>
</body>
</html>
`;

// --- Express Server Setup ---

// Route to serve the HTML content
app.get('/', (req, res) => {
    res.send(workoutHtml);
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n----------------------------------------------------------------------`);
    console.log(` Calisthenics Web Timer running at: http://localhost:${PORT}`);
    console.log(`----------------------------------------------------------------------\n`);
});
