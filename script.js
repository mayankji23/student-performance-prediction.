/**
 * AI Student Performance Predictor Pro
 * Machine Learning Architecture, Complete Subject Plan & AI Chatbot Logic
 */

let net;
let chartInstance;
let trainingData = [];

// Input Elements
const hoursInput = document.getElementById('hours');
const attendanceInput = document.getElementById('attendance');
const cgpaInput = document.getElementById('cgpa');
const mathInput = document.getElementById('math');
const scienceInput = document.getElementById('science');
const englishInput = document.getElementById('english');

const predictBtn = document.getElementById('predictBtn');
predictBtn.innerText = "Initialize Dataset & Train Model";
predictBtn.disabled = false;

const statusMsg = document.getElementById('trainingStatus');
const dataLog = document.getElementById('dataLog');

const scoreCircle = document.getElementById('scoreCircle');
const scoreText = document.getElementById('scoreText');
const planList = document.getElementById('planList');
const readAloudBtn = document.getElementById('readAloudBtn');

// Voice Synth
let isSpeaking = false;
let currentStudyPlanText = "";

// Normalization Constants
const MAX_HOURS = 40;
const MAX_ATTENDANCE = 100;
const MAX_CGPA = 10.0;
const MAX_SCORE = 100;

function appendLog(msg, type="") {
    const span = document.createElement('span');
    if(type) span.className = `log-${type}`;
    span.innerText = msg;
    const now = new Date();
    const prefix = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] `;
    dataLog.innerHTML += `<br>${prefix} ` + span.outerHTML;
    dataLog.scrollTop = dataLog.scrollHeight;
}

/**
 * 1. GENERATE SYNTHETIC DATASET
 */
function generateDataset(numRecords = 300) {
    const data = [];
    appendLog(`Generating ${numRecords} synthetic student records for network training...`, "info");

    for (let i = 0; i < numRecords; i++) {
        const hours = Math.floor(Math.random() * MAX_HOURS);
        const attendance = Math.floor(Math.random() * 50) + 50; 
        const cgpa = (Math.random() * 5) + 5; // 5.0 to 10.0
        
        // Subject marks
        const math = Math.floor(Math.random() * 60) + 40; 
        const science = Math.floor(Math.random() * 60) + 40;
        const english = Math.floor(Math.random() * 60) + 40;
        
        // Final score formula
        const hoursImpact = (hours / MAX_HOURS) * 15; 
        const attImpact = (attendance / MAX_ATTENDANCE) * 15; 
        const cgpaImpact = (cgpa / MAX_CGPA) * 20;
        const subjectsImpact = ((math + science + english) / 300) * 40; 
        
        const noise = (Math.random() * 10) - 5; 
        
        let finalScore = hoursImpact + attImpact + cgpaImpact + subjectsImpact + noise + 10;
        if (finalScore > 100) finalScore = 100;
        if (finalScore < 0) finalScore = 0;

        if (i < 5 || i > numRecords - 3) {
            appendLog(`Record ${i+1}: Hrs=${hours}, Att=${attendance}%, CGPA=${cgpa.toFixed(1)}, M/S/E=${math}/${science}/${english} => Final=${finalScore.toFixed(1)}`);
        } else if (i === 5) {
            appendLog(`... continuing 6-parameter data generation...`);
        }

        data.push({
            input: { 
                h: hours/MAX_HOURS, 
                a: attendance/MAX_ATTENDANCE, 
                c: cgpa/MAX_CGPA,
                m: math/MAX_SCORE,
                s: science/MAX_SCORE,
                e: english/MAX_SCORE
            },
            output: { f: finalScore/MAX_SCORE },
            raw: { hours, attendance, cgpa, math, science, english, finalScore }
        });
    }
    return data;
}

/**
 * 2. MAIN WORKFLOW
 */
predictBtn.addEventListener('click', () => {
    if (!net) startMLTrainingSequence();
    else makePrediction();
});

function startMLTrainingSequence() {
    predictBtn.disabled = true;
    predictBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    statusMsg.innerHTML = '<span style="color:var(--secondary)">Generating Data & Initializing Model...</span>';
    dataLog.innerHTML = "> Executing 6-vector machine learning pipeline...<br>";

    setTimeout(() => {
        trainingData = generateDataset(300);
        appendLog(`Dataset prepared. Normalizing 6 parameters (0-1.0)`, "info");
        appendLog(`Instantiating Brain.js NeuralNetwork (Hidden Layers: [6, 4])...`, "warn");

        setTimeout(() => {
            // Increased hidden layers for more complex inputs
            net = new brain.NeuralNetwork({ hiddenLayers: [6, 4], activation: 'sigmoid' });
            
            net.train(trainingData, {
                iterations: 2000,
                errorThresh: 0.005,
                log: details => appendLog(details.iterations + " iterations... error: " + details.error),
                logPeriod: 500,
                learningRate: 0.1
            });
            
            appendLog(`Model Training Complete. Optimization successful.`, "info");
            statusMsg.innerHTML = '<span style="color:var(--success)">Model Trained! Ready for Predictions.</span>';
            
            predictBtn.disabled = false;
            predictBtn.innerHTML = '<i class="fas fa-magic"></i> Predict Overall Score';
            
            initChart();
            makePrediction();

        }, 100);
    }, 100);
}

/**
 * 3. PREDICT & STUDY PLAN GENERATION
 */
function makePrediction() {
    let h = parseFloat(hoursInput.value);
    let a = parseFloat(attendanceInput.value);
    let c = parseFloat(cgpaInput.value);
    let m = parseFloat(mathInput.value);
    let s = parseFloat(scienceInput.value);
    let e = parseFloat(englishInput.value);
    
    if(isNaN(h) || isNaN(a) || isNaN(c) || isNaN(m) || isNaN(s) || isNaN(e)) return;

    appendLog(`Running prediction for vector [H:${h}, A:${a}, C:${c.toFixed(1)}, M:${m}, S:${s}, E:${e}]...`);

    const result = net.run({ 
        h: h/MAX_HOURS, 
        a: a/MAX_ATTENDANCE, 
        c: c/MAX_CGPA,
        m: m/MAX_SCORE,
        s: s/MAX_SCORE,
        e: e/MAX_SCORE
    });
    
    let finalScore = Math.round(result.f * MAX_SCORE);
    if(finalScore > 100) finalScore = 100;
    if(finalScore < 0) finalScore = 0;
    
    updateUI(finalScore);
    updateChart(h, a, m, s, e);
    generateStudyPlan(h, a, c, m, s, e, finalScore);
}

function updateUI(score) {
    let color = "var(--success)";
    if (score < 50) color = "var(--danger)";
    else if (score < 75) color = "var(--warning)";
    
    scoreCircle.style.strokeDasharray = `${score}, 100`;
    scoreCircle.style.stroke = color;
    animateValue(scoreText, parseInt(scoreText.innerText) || 0, score, 1500);
}

/**
 * 4. ACTIONABLE STUDY PLAN & AI VOICE ENGINE
 */
function generateStudyPlan(hours, attendance, cgpa, math, science, english, finalScore) {
    planList.innerHTML = ''; 
    const ideas = [];

    // Evaluate CGPA
    if (cgpa < 6.0) ideas.push(`<strong>Rebuild Overall Foundation:</strong> Your current CGPA of ${cgpa} outlines a need for structural academic changes. We recommend scheduling a meeting with an academic advisor this week. Furthermore, implement the <strong>Feynman Technique</strong>—try teaching complex topics to a peer to expose gaps in your fundamental understanding before moving to advanced material.`);
    else if (cgpa >= 9.0) ideas.push(`<strong>Maintain Elite Performance:</strong> You have an exceptional CGPA of ${cgpa}. Your primary risk now is academic burnout. Ensure you are taking one full day off per week from studying. To push for maximum scores, transition from passive reading to completing timed, high-pressure practice exams.`);

    // Evaluate Subjects
    const lowestSubject = Math.min(math, science, english);
    if (lowestSubject === math && math < 70) {
        ideas.push(`<strong>Prioritize Mathematics Mastery:</strong> Math is currently your weakest subject (${math}%). Mathematics is cumulative; you must master early concepts. For the next 14 days, allocate 40% of your total study time exclusively to solving math problem sets. Do not just review notes—active problem solving is the only proven method to increase quantitative retention.`);
    } else if (lowestSubject === science && science < 70) {
        ideas.push(`<strong>Revise Scientific Concepts:</strong> Your science score (${science}%) is suppressing your overall projection. Science requires both conceptual understanding and factual memorization. Start utilizing <strong>Spaced Repetition Flashcards</strong> for key terminology, and watch visual lab experiments online to connect abstract theories to real-world applications.`);
    } else if (lowestSubject === english && english < 70) {
        ideas.push(`<strong>Enhance English Literature Skills:</strong> To elevate your English score (${english}%), you must immerse yourself in text analysis. Dedicate 30 minutes daily to reading scholarly articles outside your curriculum. When writing essays, rigidly adhere to the PEEL structure (Point, Evidence, Explain, Link) to ensure your arguments are logically sound and persuasive.`);
    }

    // Evaluate General Habits
    if (attendance < 75) {
        ideas.push(`<strong>Rectify Chronic Absenteeism:</strong> Your attendance of ${attendance}% is statistically correlated with a high risk of failure. Physical presence in lectures exposes you to auditory learning cues and professor emphasis that are absent from textbooks. Commit to a 95% attendance rate for the remainder of the semester.`);
    }
    else if (hours < 10 && ideas.length < 3) {
        ideas.push(`<strong>Expand Dedicated Study Blocks:</strong> Dedicated studying for only ${hours} hours per week is critically insufficient for your target grade. Immediately implement the <strong>Pomodoro Technique</strong> (25 minutes deep focus, 5 minutes rest). Use this framework to safely scale your output by an additional 8-10 hours weekly without provoking mental fatigue.`);
    }
    
    if (ideas.length < 3) ideas.push(`<strong>Optimize Neuro-Physical Health:</strong> Our machine learning model assumes optimal cognitive function. Ensure you achieve precisely 7.5 to 8 hours of sleep, particularly during the two nights immediately preceding an exam. Sleep deprivation heavily impacts working memory and fluid intelligence, which are vital for test-taking.`);

    // Take top 3
    const finalIdeas = ideas.slice(0, 3);
    
    // Prepare Voice Text by stripping HTML tags
    currentStudyPlanText = "Here is your personalized AI study plan. " + finalIdeas.map((idea, index) => {
        return `Step ${index + 1}: ` + idea.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML
    }).join(" ");

    // Animate DOM
    finalIdeas.forEach((idea, idx) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.innerHTML = idea;
            li.style.opacity = '0';
            li.style.transform = 'translateX(-10px)';
            li.style.transition = 'all 0.4s ease';
            planList.appendChild(li);
            void li.offsetWidth;
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
        }, idx * 400); 
    });
}

// Global reference to prevent garbage collection bug in some browsers
let currentUtterance = null;

// Trigger voice loading immediately
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

// Web Speech API Voice Dictation handling
readAloudBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
        alert("Sorry, your browser does not support the Web Speech API.");
        return;
    }

    // If currently speaking, stop it safely
    if (isSpeaking || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        readAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        readAloudBtn.classList.remove('active');
        readAloudBtn.style.color = 'var(--secondary)';
        isSpeaking = false;
        return;
    }

    if (!currentStudyPlanText) {
        alert("Please run a prediction first to generate a study plan!");
        return;
    }

    // Cancel any ghost utterances
    window.speechSynthesis.cancel();

    currentUtterance = new SpeechSynthesisUtterance(currentStudyPlanText);
    currentUtterance.rate = 1.0;
    currentUtterance.pitch = 1.0;

    // Try to find an English voice, fallback to default
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        let engVoice = voices.find(v => v.name.includes('Microsoft Zira') || v.name.includes('Google US English'));
        if (!engVoice) engVoice = voices.find(v => v.lang.startsWith('en'));
        if (engVoice) currentUtterance.voice = engVoice;
    }

    currentUtterance.onstart = () => {
        isSpeaking = true;
        readAloudBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        readAloudBtn.classList.add('active');
        readAloudBtn.style.color = 'var(--danger)';
    };

    currentUtterance.onend = () => {
        isSpeaking = false;
        readAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        readAloudBtn.classList.remove('active');
        readAloudBtn.style.color = 'var(--secondary)';
    };
    
    currentUtterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        isSpeaking = false;
        readAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        readAloudBtn.classList.remove('active');
        readAloudBtn.style.color = 'var(--secondary)';
        if(e.error !== 'interrupted' && e.error !== 'canceled') {
             alert('Voice assistant encountered an error mapping the audio. Please check browser permissions.');
        }
    };

    window.speechSynthesis.speak(currentUtterance);
});


function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + '%';
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

/**
 * 5. CHART VISUALS
 */
function initChart() {
    if (chartInstance) chartInstance.destroy();

    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Calculate A+ Student averages locally
    const topStudents = trainingData.filter(d => d.raw.finalScore >= 85);
    const count = topStudents.length || 1;
    
    const avgH = (topStudents.reduce((s, d) => s + d.raw.hours, 0) / count) / MAX_HOURS * 100; // Normalized to 100%
    const avgA = topStudents.reduce((s, d) => s + d.raw.attendance, 0) / count;
    const avgM = topStudents.reduce((s, d) => s + d.raw.math, 0) / count;
    const avgS = topStudents.reduce((s, d) => s + d.raw.science, 0) / count;
    const avgE = topStudents.reduce((s, d) => s + d.raw.english, 0) / count;
    
    window.topAvgs = [avgH, avgA, avgM, avgS, avgE];

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Study Hours', 'Attendance', 'Math', 'Science', 'English'],
            datasets: [
                {
                    label: 'A+ Student Average (%)',
                    data: window.topAvgs,
                    backgroundColor: 'rgba(20, 184, 166, 0.6)',
                    borderColor: 'rgba(20, 184, 166, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Current Prediction (%)',
                    data: [0, 0, 0, 0, 0], 
                    backgroundColor: 'rgba(244, 63, 94, 0.8)', 
                    borderColor: '#f43f5e',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { title: { display: true, text: 'Relative Percentage (%)', color: '#a1a1aa' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' }, min: 0, max: 100 },
                x: { grid: { display: false }, ticks: { color: '#a1a1aa' } }
            },
            plugins: { legend: { labels: { color: '#f8fafc' } } }
        }
    });
}

function updateChart(hours, att, math, sci, eng) {
    if (!chartInstance) return;
    const normH = (hours / MAX_HOURS) * 100;
    chartInstance.data.datasets[1].data = [normH, att, math, sci, eng];
    chartInstance.update();
}

/**
 * 6. AI DOUBT TUTOR CHATBOT LOGIC (Wikipedia Integration)
 */
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatWindow = document.getElementById('chatWindow');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');

chatToggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) chatInput.focus();
});

closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

const botKnowledge = [
    { keywords: ["how", "does", "this", "model", "work", "brain"], response: "Our Neural Network uses Brain.js! It now takes 6 inputs (hours, attendance, CGPA, Math, Science, English), passes them through hidden layers, and outputs a normalized overall prediction based on the training dataset." }
];

async function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendMessage(text, 'user-msg');
    chatInput.value = '';
    const typingId = showTypingIndicator();
    
    let matchedResponse = null;
    const lowerText = text.toLowerCase();
    
    for (let entry of botKnowledge) {
        if (entry.keywords.some(kw => lowerText.includes(kw))) {
            matchedResponse = entry.response;
            break;
        }
    }
    
    setTimeout(async () => {
        removeTypingIndicator(typingId);
        
        if (matchedResponse) {
            appendMessage(matchedResponse, 'bot-msg');
        } else {
            try {
                const query = encodeURIComponent(text);
                // Generator search lets us find the best match and grab its detailed extract text in one call
                const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrlimit=1&prop=extracts&exchars=800&explaintext=1&format=json&origin=*`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.query && data.query.pages) {
                    // Extract the first (and only) page from the pages object
                    const page = Object.values(data.query.pages)[0];
                    
                    if (page && page.extract) {
                        const title = page.title;
                        const extract = page.extract;
                        appendMessage(`Here is a detailed explanation answering your doubt regarding **${title}**:<br><br>${extract}`, 'bot-msg');
                    } else {
                        appendMessage("I couldn't find an exact academic answer for that doubt in my textbook knowledge base! Could you try rephrasing?", 'bot-msg');
                    }
                } else {
                    appendMessage("I couldn't find an exact academic answer for that doubt in my textbook knowledge base! Could you try rephrasing?", 'bot-msg');
                }
            } catch (err) {
                appendMessage("I am currently having trouble connecting to my knowledge base. Please try again later!", 'bot-msg');
            }
        }
    }, 1200 + Math.random() * 800);
}

function appendMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerHTML = text; 
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = id;
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

sendChatBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

// Splash Screen Transition Logic
const splashScreen = document.getElementById('splashScreen');
const mainContainer = document.getElementById('mainContainer');
const enterSystemBtn = document.getElementById('enterSystemBtn');

if (splashScreen && mainContainer && enterSystemBtn) {
    enterSystemBtn.addEventListener('click', () => {
        // Change button to show loading state
        enterSystemBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing...';
        enterSystemBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            splashScreen.style.opacity = '0';
            
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContainer.style.display = 'block';
                
                // Small delay to allow display:block to calculate before fading in
                setTimeout(() => {
                    mainContainer.style.opacity = '1';
                    mainContainer.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 50);
            }, 1000); 
        }, 800);
    });
}
