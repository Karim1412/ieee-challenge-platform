import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ACHIEVEMENTS } from './challengeData';

// Submit a score for a challenge
export async function submitChallengeScore(uid, challengeId, score, rank) {
  const userRef = doc(db, 'users', uid);

  await updateDoc(userRef, {
    completedChallenges: arrayUnion(challengeId),
    totalPoints: increment(score),
    [`challengeScores.${challengeId}`]: score,
    [`challengeRanks.${challengeId}`]: rank,
  });

  // Check achievements
  await checkAndGrantAchievements(uid, challengeId, score, rank);
}

// Check and grant achievements
export async function checkAndGrantAchievements(uid, challengeId, score, rank) {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const existing = data.achievements || [];
  const completed = data.completedChallenges || [];
  const newAchievements = [];

  const grant = (id) => {
    if (!existing.includes(id)) newAchievements.push(id);
  };

  // First challenge
  if (completed.length === 0) grant('first_challenge');

  // First win
  if (rank === 1) grant('first_win');

  // Top 3
  if (rank <= 3) grant('top3');

  // All challenges
  const allIds = ['snake', 'quiz', 'reaction', 'memory'];
  const allDone = allIds.every(id => completed.includes(id) || id === challengeId);
  if (allDone) grant('all_challenges');

  // Century - 100 pts
  if (score >= 100) grant('century');

  if (newAchievements.length > 0) {
    await updateDoc(userRef, {
      achievements: arrayUnion(...newAchievements),
    });
  }

  return newAchievements;
}

// Grant a specific achievement
export async function grantAchievement(uid, achievementId) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    achievements: arrayUnion(achievementId),
  });
}

// Get top N leaderboard
export async function getLeaderboard(n = 10) {
  const q = query(
    collection(db, 'users'),
    orderBy('totalPoints', 'desc'),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({
    uid: d.id,
    rank: i + 1,
    ...d.data(),
  }));
}

// Get user rank
export async function getUserRank(uid) {
  const q = query(collection(db, 'users'), orderBy('totalPoints', 'desc'));
  const snap = await getDocs(q);
  const users = snap.docs.map(d => d.id);
  return users.indexOf(uid) + 1;
}

// Get challenge leaderboard for ranking points
export async function getChallengeRanking(challengeId) {
  const q = query(collection(db, 'users'), orderBy(`challengeScores.${challengeId}`, 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({
    uid: d.id,
    rank: i + 1,
    score: d.data().challengeScores?.[challengeId] ?? 0,
    name: d.data().name,
  }));
}
