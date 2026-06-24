const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
};

const BASE_URL = 'http://localhost:8080/api/v1';

async function runEndToEndTest() {
  console.log('🚀 Starting Arviona Full End-to-End Workflow Testing...\n');

  // ==========================================
  // STEP 1: STUDENT LOGIN & DASHBOARD FETCH
  // ==========================================
  console.log('--- Step 1: Student Login & Dashboard ---');
  let loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@arviona.com', password: 'password' })
  });
  
  assert(loginRes.ok, 'Student login should succeed');
  let studentData = await loginRes.json();
  const studentToken = studentData.accessToken;
  const studentId = studentData.id;
  assert(studentToken != null, 'Student access token should be returned');
  assert(studentData.roles.includes('ROLE_STUDENT'), 'User should have ROLE_STUDENT authority');

  // Fetch Student Dashboard
  let studentDashRes = await fetch(`${BASE_URL}/students/dashboard`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(studentDashRes.ok, 'Student dashboard retrieval should succeed');
  let studentDash = await studentDashRes.json();
  assert(studentDash.profile.name === 'Lucas Miller', 'Student name should be Lucas Miller');
  assert(studentDash.classes.length > 0, 'Student should be enrolled in classes');
  console.log(`Student enrolled classes: ${studentDash.classes.map(c => c.name).join(', ')}`);

  // ==========================================
  // STEP 2: STUDENT INTERACTION WITH AI TUTOR
  // ==========================================
  console.log('\n--- Step 2: Student AI Tutor Interaction ---');
  let aiRes = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      message: 'Explain what is a derivative in calculus',
      systemInstruction: 'You are a helpful math tutor. Keep it very short.'
    })
  });
  assert(aiRes.ok, 'AI Tutor chat request should succeed');
  let aiData = await aiRes.json();
  assert(aiData.response != null, 'AI response should not be empty');
  console.log(`Arivo AI Assistant response:\n"${aiData.response.trim()}"`);

  // ==========================================
  // STEP 3: STUDENT SUBMITS ASSIGNMENT
  // ==========================================
  console.log('\n--- Step 3: Student Assignment Submission ---');
  // Check pending assignment ID from dashboard (Calculus Assignment 1 has ID: 'assign-1')
  const assignmentId = 'assign-1';
  let submissionRes = await fetch(`${BASE_URL}/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({ submissionUrl: 'https://github.com/lucas/calculus-1' })
  });
  
  // Note: Since data.sql seeds the database with a pre-existing submission, it might throw a duplicate error,
  // so we handle both success or duplicate notification gracefully.
  if (submissionRes.status === 400) {
    let errBody = await submissionRes.json();
    if (errBody.message.includes('already submitted')) {
      console.log('ℹ️ Student has already submitted this assignment (seeded from data.sql). Proceeding...');
    } else {
      assert(false, `Submission failed: ${errBody.message}`);
    }
  } else {
    assert(submissionRes.ok, 'Assignment submission should succeed');
    console.log('Assignment submitted successfully.');
  }

  // Fetch submissions from DB to get the submission ID for grading
  // We'll log in as teacher to inspect submissions
  
  // ==========================================
  // STEP 4: TEACHER LOGIN & DASHBOARD FETCH
  // ==========================================
  console.log('\n--- Step 4: Teacher Login & Dashboard ---');
  let teacherLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'teacher@arviona.com', password: 'password' })
  });
  assert(teacherLoginRes.ok, 'Teacher login should succeed');
  let teacherData = await teacherLoginRes.json();
  const teacherToken = teacherData.accessToken;
  assert(teacherData.roles.includes('ROLE_TEACHER'), 'User should have ROLE_TEACHER authority');

  // Fetch Teacher Dashboard
  let teacherDashRes = await fetch(`${BASE_URL}/teachers/dashboard`, {
    headers: { 'Authorization': `Bearer ${teacherToken}` }
  });
  assert(teacherDashRes.ok, 'Teacher dashboard retrieval should succeed');
  let teacherDash = await teacherDashRes.json();
  assert(teacherDash.profile.name === 'Sarah Connor', 'Teacher name should be Sarah Connor');
  console.log(`Teacher teaching classes: ${teacherDash.classes.map(c => c.name).join(', ')}`);

  // ==========================================
  // STEP 5: TEACHER GRADES STUDENT SUBMISSION
  // ==========================================
  console.log('\n--- Step 5: Teacher Grades Student Submission ---');
  // Seeded submission ID from data.sql is 'sub-1'
  const submissionId = 'sub-1';
  let gradeRes = await fetch(`${BASE_URL}/submissions/${submissionId}/grade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      grade: 'A',
      marksObtained: 98,
      feedback: 'Excellent work on derivatives!'
    })
  });
  assert(gradeRes.ok, 'Teacher grading should succeed');
  let gradedSubmission = await gradeRes.json();
  assert(gradedSubmission.grade === 'A', 'Submission grade should update to A');
  assert(gradedSubmission.marksObtained === 98, 'Submission marks should update to 98');
  console.log('Submission graded successfully by Teacher.');

  // ==========================================
  // STEP 6: PARENT LOGIN & PROGRESS REVIEW
  // ==========================================
  console.log('\n--- Step 6: Parent Login & Progress Review ---');
  let parentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'parent@arviona.com', password: 'password' })
  });
  assert(parentLoginRes.ok, 'Parent login should succeed');
  let parentData = await parentLoginRes.json();
  const parentToken = parentData.accessToken;
  assert(parentData.roles.includes('ROLE_PARENT'), 'User should have ROLE_PARENT authority');

  // Fetch Parent Dashboard
  let parentDashRes = await fetch(`${BASE_URL}/parents/dashboard`, {
    headers: { 'Authorization': `Bearer ${parentToken}` }
  });
  assert(parentDashRes.ok, 'Parent dashboard retrieval should succeed');
  let parentDash = await parentDashRes.json();
  assert(parentDash.profile.name === 'John Miller', 'Parent name should be John Miller');
  
  // Verify linked child stats
  assert(parentDash.children.length > 0, 'Parent should have linked children');
  let child = parentDash.children[0];
  console.log(`Parent linked child: ${child.name}`);
  
  // Verify that parent sees the updated grade
  let childMathAssignment = child.details.assignments.find(a => a.id === 'assign-1');
  assert(childMathAssignment.submitted === true, 'Parent should see assignment is submitted');
  assert(childMathAssignment.marksObtained === 98, 'Parent should see updated score of 98');
  assert(childMathAssignment.grade === 'A', 'Parent should see updated grade of A');
  assert(childMathAssignment.feedback === 'Excellent work on derivatives!', 'Parent should see teacher feedback');

  // ==========================================
  // STEP 7: GAMIFICATION ENGINE & AI KNOWLEDGE MAP VERIFICATION
  // ==========================================
  console.log('\n--- Step 7: Gamification Engine & AI Knowledge Map ---');
  
  // 7.1 Fetch Gamification Profile
  let profileRes = await fetch(`${BASE_URL}/gamification/profile`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(profileRes.ok, 'Gamification profile retrieval should succeed');
  let profile = await profileRes.json();
  assert(profile.level === 18, 'Profile level should be 18');
  assert(profile.xpTotal === 18450, 'Profile XP should be 18450');
  assert(profile.pet.nickname === 'Ignis', 'Pet nickname should be Ignis');
  assert(profile.pet.evolutionStage === 'ADVANCED', 'Pet stage should be ADVANCED');
  assert(profile.badges.length > 0, 'Should have at least one badge unlocked');
  assert(profile.knowledgeMap.length > 0, 'Knowledge map should contain seeded topics');
  console.log(`Student Pet: ${profile.pet.nickname} (${profile.pet.evolutionStage} stage)`);
  console.log(`Knowledge Map entries: ${profile.knowledgeMap.map(k => `${k.topic}:${k.subtopic}(${k.status})`).join(', ')}`);

  // 7.2 Rename Pet
  let renameRes = await fetch(`${BASE_URL}/gamification/pet/rename`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({ nickname: 'Drago' })
  });
  assert(renameRes.ok, 'Renaming pet should succeed');
  let renameData = await renameRes.json();
  assert(renameData.nickname === 'Drago', 'Renamed pet nickname should be Drago');
  console.log('Pet renamed to Drago successfully.');

  // 7.3 Fetch Houses Standings
  let housesRes = await fetch(`${BASE_URL}/gamification/houses`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(housesRes.ok, 'House scoreboard retrieval should succeed');
  let houses = await housesRes.json();
  assert(houses.length > 0, 'Houses scoreboard should not be empty');
  assert(houses[0].name === 'Red House', 'Red House should lead scoreboard');
  console.log(`House standings: ${houses.map(h => `${h.name}: ${h.totalPoints} pts`).join(', ')}`);

  // 7.4 Submit Quest
  const questId = 'quest-science-1';
  let questSubmitRes = await fetch(`${BASE_URL}/quests/${questId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      submissionUrl: 'https://github.com/lucas/physics-quantum',
      completedSteps: ['Research wave-particle duality', 'Write outline', 'Submit draft']
    })
  });
  
  if (questSubmitRes.status === 400) {
    let errBody = await questSubmitRes.json();
    if (errBody.message.includes('already been submitted')) {
      console.log('ℹ️ Quest already submitted. Skipping submit quest assertions.');
    } else {
      assert(false, `Quest submission failed: ${errBody.message}`);
    }
  } else {
    assert(questSubmitRes.ok, 'Quest submission should succeed');
    let questResult = await questSubmitRes.json();
    assert(questResult.xpGained === 200, 'Quest reward XP should be 200');
    console.log(`Quest submitted successfully. New level: ${questResult.newLevel}, New XP: ${questResult.xpTotal}`);
  }

  // 7.5 Start and Submit Boss Battle
  const battleId = 'boss-math-1';
  let startBattleRes = await fetch(`${BASE_URL}/boss-battles/${battleId}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    }
  });
  assert(startBattleRes.ok, 'Starting boss battle should succeed');
  let battleInfo = await startBattleRes.json();
  assert(battleInfo.title === 'Calculus Boss Battle', 'Boss battle title should match Calculus Boss Battle');

  let submitBattleRes = await fetch(`${BASE_URL}/boss-battles/${battleId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({})
  });
  assert(submitBattleRes.ok, 'Submitting boss battle should succeed');
  let battleResult = await submitBattleRes.json();
  assert(battleResult.xpGained === 300, 'Boss Battle reward XP should be 300');
  console.log(`Boss battle completed successfully. Message: "${battleResult.message}"`);

  console.log('\n🌟 ALL E2E WORKFLOW TESTS COMPLETED SUCCESSFULLY! 🌟');
}

runEndToEndTest().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
