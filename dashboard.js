const role = sessionStorage.getItem('stacklyRole');
const email = sessionStorage.getItem('stacklyEmail') || '';
const page = document.body.dataset.dashboardPage || 'overview';

const images = {
  visual: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?fm=webp&fit=crop&w=700&q=40',
  code: 'https://images.unsplash.com/photo-1518770660439-4636190af475?fm=webp&fit=crop&w=700&q=40',
  kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?fm=webp&fit=crop&w=700&q=40',
  language: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?fm=webp&fit=crop&w=700&q=40',
  audio: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?fm=webp&fit=crop&w=700&q=40',
  studio: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?fm=webp&fit=crop&w=700&q=40',
  studentBanner: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?fm=webp&fit=crop&w=700&q=40',
  instructorBanner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?fm=webp&fit=crop&w=700&q=40'
};

const dataByRole = {
  student: {
    label: 'Student workspace',
    subtitle: 'Pick up a class, explore a new subject, or make a little progress today.',
    bannerTag: 'YOUR LEARNING SPACE',
    bannerTitle: 'A little progress adds up.',
    bannerCopy: 'Make time for curiosity. Build skills one practical class at a time.',
    bannerImage: images.studentBanner,
    stats: [['3', 'Classes in progress'], ['61%', 'Learning progress'], ['12.5h', 'Time spent learning']],
    planTitle: 'Your focus for the week.',
    weeklyPlan: [['01', 'Practice', 'Visual Design', 'Finish one composition exercise and save the version you like best.', '15–20 MIN'], ['02', 'Build', 'Code Systems', 'Try one short logic challenge and write down your approach.', '20 MIN'], ['03', 'Reflect', 'Your learning', 'Note one thing that clicked and one question to revisit.', '5 MIN']],
    milestones: [['VISUAL DESIGN', 'Complete module 6', 'Choose one composition and explain why it works.'], ['CODE SYSTEMS', 'Finish a logic exercise', 'Test a small idea and save your notes.'], ['AUDIO PRODUCTION', 'Prepare your first mix', 'Review levels and make one final adjustment.']],
    activityTitle: 'Keep your momentum.',
    activity: [
      ['✓', 'Lesson completed', 'Color, contrast, and visual focus', 'VISUAL DESIGN'],
      ['↗', 'Practice saved', 'Conditional logic exercise', 'CODE SYSTEMS'],
      ['✦', 'Recommended next', 'Record your first voice track', 'AUDIO PRODUCTION']
    ],
    courses: [
      ['Visual Design', 'Composition & visual hierarchy', images.visual, '68%', 'LESSON 6 OF 9', 'Resume class'],
      ['Code Systems', 'Foundations of code systems', images.code, '34%', 'MODULE 2 OF 6', 'Continue learning'],
      ['Audio Production', 'Recording clear, confident audio', images.audio, '82%', 'UNIT 4 OF 5', 'Resume class']
    ],
    quickLinks: [['Browse subjects', 'subjects.html'], ['My workspace', 'my-workspace.html'], ['Get help', 'contact.html']],
    tip: 'Try setting aside one focused practice session this week.'
  },
  instructor: {
    label: 'Instructor workspace',
    subtitle: 'Organize your courses, support learners, and share what you know.',
    bannerTag: 'YOUR TEACHING SPACE',
    bannerTitle: 'Turn what you know into a class.',
    bannerCopy: 'Create practical learning experiences shaped around your craft.',
    bannerImage: images.instructorBanner,
    stats: [['4', 'Courses published'], ['128', 'Active learners'], ['76%', 'Avg. completion']],
    planTitle: 'A clear focus for the week.',
    weeklyPlan: [['01', 'Review', 'Code Systems', 'Check the first module flow and add a practical exercise.', 'COURSE PLAN'], ['02', 'Respond', 'Learner community', 'Answer questions and note where learners need more context.', 'COMMUNITY'], ['03', 'Prepare', 'Next class', 'Set a learning goal and gather the materials for the session.', 'LESSON PLAN']],
    milestones: [['VISUAL DESIGN', 'Review learner feedback', 'Look for one improvement to make in the next lesson.'], ['CODE SYSTEMS', 'Complete the course outline', 'Clarify the outcome for each module.'], ['AUDIO PRODUCTION', 'Prepare the next lesson', 'Gather an example that learners can practice with.']],
    activityTitle: 'A pulse on your classes.',
    activity: [
      ['●', 'New learner question', 'Composition & visual hierarchy', 'VISUAL DESIGN'],
      ['✓', 'Course milestone', 'First module is ready for review', 'CODE SYSTEMS'],
      ['↗', 'Learner feedback', 'New feedback is ready to read', 'AUDIO PRODUCTION']
    ],
    courses: [
      ['Visual Design', 'Composition & visual hierarchy', images.visual, 'PUBLISHED', '24 LEARNERS', 'View course'],
      ['Code Systems', 'Foundations of code systems', images.code, 'DRAFT', 'READY TO REVIEW', 'Edit course'],
      ['Audio Production', 'Recording clear, confident audio', images.audio, 'PUBLISHED', '18 LEARNERS', 'View course']
    ],
    quickLinks: [['Plan a new course', 'contact.html'], ['Subjects', 'subjects.html'], ['Get help', 'contact.html']],
    tip: 'A clear learning outcome gives every lesson a strong direction.'
  }
};

const subjects = [
  ['Visual Design', 'Shape thoughtful visual experiences, from the first sketch to a polished system.', images.visual],
  ['Code Systems', 'Build digital tools with clear logic, useful structure, and room to grow.', images.code],
  ['Culinary Arts', 'Explore ingredients, technique, and the craft of creating memorable food.', images.kitchen],
  ['Spoken Languages', 'Build confidence through conversation, listening, and everyday practice.', images.language],
  ['Audio Production', 'Record, shape, and mix sound into work that feels clear and considered.', images.audio],
  ['Studio Strategy', 'Turn early ideas into focused plans teams can put into action.', images.studio]
];

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function renderActivity(data) {
  const target = document.getElementById('dashboardActivity');
  if (!target) return;
  target.innerHTML = data.activity.map(function (item) {
    return '<article><span class="activity-icon" aria-hidden="true">' + item[0] + '</span><div><strong>' + item[1] + '</strong><p>' + item[2] + '</p><small>' + item[3] + '</small></div></article>';
  }).join('');
}

function renderCourses(data, isStudent) {
  const target = document.getElementById('dashboardWorkspace');
  if (!target) return;
  target.innerHTML = data.courses.map(function (course) {
    const detail = isStudent
      ? '<div class="course-progress"><span style="width:' + course[3] + '"></span></div><div class="course-meta"><span>' + course[4] + '</span><strong>' + course[3] + '</strong></div>'
      : '<div class="course-meta course-instructor-meta"><span>' + course[4] + '</span><strong>' + course[3] + '</strong></div>';
    return '<article class="dashboard-course-card"><div class="dashboard-course-image"><img src="' + course[2] + '" alt="" loading="lazy"><span>' + course[0].toUpperCase() + '</span></div><div class="dashboard-course-copy"><h3>' + course[1] + '</h3>' + detail + '<a href="contact.html">' + course[5] + ' <b>↗</b></a></div></article>';
  }).join('');
}

if (!role || !dataByRole[role]) {
  window.location.replace('login.html');
} else {
  const data = dataByRole[role];
  const isStudent = role === 'student';

  setText('dashboardRole', data.label);
  setText('dashboardEmail', email);
  setText('dashboardAvatar', isStudent ? 'S' : 'I');

  if (page === 'overview') {
    setText('dashboardEyebrow', isStudent ? 'STUDENT OVERVIEW' : 'INSTRUCTOR OVERVIEW');
    setText('dashboardTitle', 'Welcome back.');
    setText('dashboardSubtitle', data.subtitle);
    setText('dashboardBannerTag', data.bannerTag);
    setText('dashboardBannerTitle', data.bannerTitle);
    setText('dashboardBannerCopy', data.bannerCopy);
    const banner = document.getElementById('dashboardBannerImage');
    if (banner) {
      banner.src = data.bannerImage;
      banner.alt = isStudent ? 'Students collaborating in a creative learning studio' : 'Instructor leading a collaborative class session';
    }
    const action = document.getElementById('dashboardAction');
    if (action) {
      action.href = isStudent ? 'subjects.html' : 'my-workspace.html';
      action.innerHTML = (isStudent ? 'Explore subjects' : 'View your courses') + ' <span>↗</span>';
    }
    const summary = document.getElementById('dashboardSummary');
    if (summary) summary.innerHTML = data.stats.map(function (item) {
      return '<article><strong>' + item[0] + '</strong><span>' + item[1] + '</span></article>';
    }).join('');
    setText('planTitle', data.planTitle);
    const plan = document.getElementById('dashboardPlan');
    if (plan) plan.innerHTML = data.weeklyPlan.map(function (item) {
      return '<article><span class="plan-number">' + item[0] + '</span><div class="plan-label">' + item[1] + ' <small>' + item[4] + '</small></div><h3>' + item[2] + '</h3><p>' + item[3] + '</p></article>';
    }).join('');
    setText('activityTitle', data.activityTitle);
    renderActivity(data);
    const quickLinks = document.getElementById('dashboardQuickLinks');
    if (quickLinks) quickLinks.innerHTML = data.quickLinks.map(function (item) {
      return '<a href="' + item[1] + '"><span class="quick-link-index">0' + (data.quickLinks.indexOf(item) + 1) + '</span><span class="quick-link-name">' + item[0] + '</span><b aria-hidden="true">↗</b></a>';
    }).join('');
    setText('dashboardTip', data.tip);
  }

  if (page === 'workspace') {
    setText('dashboardEyebrow', isStudent ? 'STUDENT WORKSPACE' : 'INSTRUCTOR WORKSPACE');
    setText('dashboardTitle', isStudent ? 'Your learning space.' : 'Your teaching studio.');
    setText('dashboardSubtitle', isStudent
      ? 'Your classes, progress, and recent learning activity.'
      : 'Your courses, learners, and recent teaching activity.');
    setText('workspaceEyebrow', isStudent ? 'LEARNING IN PROGRESS' : 'COURSE MANAGEMENT');
    setText('dashboardSectionTitle', isStudent ? 'Continue where you left off.' : 'Manage your courses.');
    const action = document.getElementById('dashboardAction');
    if (action) {
      action.href = isStudent ? 'subjects.html' : 'contact.html';
      action.innerHTML = (isStudent ? 'Explore subjects' : 'Plan a course') + ' <span>↗</span>';
    }
    const summary = document.getElementById('dashboardSummary');
    if (summary) summary.innerHTML = data.stats.map(function (item) {
      return '<article><strong>' + item[0] + '</strong><span>' + item[1] + '</span></article>';
    }).join('');
    renderCourses(data, isStudent);
    const milestones = document.getElementById('dashboardMilestones');
    if (milestones) milestones.innerHTML = data.milestones.map(function (item, index) {
      return '<article><span class="milestone-index">0' + (index + 1) + '</span><div><small>' + item[0] + '</small><h4>' + item[1] + '</h4><p>' + item[2] + '</p></div><span class="milestone-state">UP NEXT</span></article>';
    }).join('');
    setText('activityTitle', isStudent ? 'Recent learning activity.' : 'Recent course activity.');
    renderActivity(data);
  }

  if (page === 'subjects') {
    setText('dashboardEyebrow', isStudent ? 'EXPLORE STACKLY' : 'TEACHING AREAS');
    setText('dashboardTitle', isStudent ? 'Find a subject that sparks your curiosity.' : 'Explore areas for your next class.');
    setText('dashboardSubtitle', isStudent
      ? 'Choose a path and build something useful with what you learn.'
      : 'Browse practical subjects for curious makers and independent builders.');
    setText('subjectsEyebrow', isStudent ? 'LEARNING AREAS' : 'COURSE AREAS');
    setText('subjectsTitle', isStudent ? 'Choose where you want to begin.' : 'Find the right focus for your learners.');
    setText('subjectsIntro', isStudent
      ? 'Explore practical classes for curious makers and independent builders.'
      : 'Each subject can become a hands-on learning experience shaped around your expertise.');
    const subjectsNode = document.getElementById('dashboardSubjects');
    if (subjectsNode) subjectsNode.innerHTML = subjects.map(function (item) {
      return '<article class="dashboard-subject-card"><div class="dashboard-subject-image"><img src="' + item[2] + '" alt="" loading="lazy"><span>' + (isStudent ? 'LEARNING AREA' : 'TEACHING AREA') + '</span></div><div class="dashboard-subject-copy"><h3>' + item[0] + '</h3><p>' + item[1] + '</p><a href="contact.html" aria-label="Ask about ' + item[0] + '"><strong>Ask about this subject <b>↗</b></strong></a></div></article>';
    }).join('');
  }

  if (page === 'support') {
    setText('dashboardEyebrow', isStudent ? 'STUDENT SUPPORT' : 'INSTRUCTOR SUPPORT');
    setText('dashboardTitle', 'How can we help?');
    setText('dashboardSubtitle', isStudent
      ? 'Find a quick answer about your learning space or get in touch with our team.'
      : 'Find a quick answer about teaching and courses, or get in touch with our team.');
  }
}

const logoutButton = document.getElementById('logoutButton');
if (logoutButton) logoutButton.addEventListener('click', function () {
  sessionStorage.removeItem('stacklyRole');
  sessionStorage.removeItem('stacklyEmail');
  window.location.href = 'login.html';
});

document.addEventListener('click', function (event) {
  const action = event.target.closest('.dashboard-main a, .dashboard-main button');
  if (!action) return;
  event.preventDefault();
  window.location.href = '404.html';
});
