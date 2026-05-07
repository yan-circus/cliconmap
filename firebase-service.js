// Requires Firebase compat SDK loaded via CDN in index.html

const firebaseConfig = {
  apiKey:            'AIzaSyDz1xCHbgqWsmhp1H5bia8smICmjBbi3uc',
  authDomain:        'ludoedu-fea1d.firebaseapp.com',
  projectId:         'ludoedu-fea1d',
  storageBucket:     'ludoedu-fea1d.firebasestorage.app',
  messagingSenderId: '595877165459',
  appId:             '1:595877165459:web:8e0fbd53344e3d7f899066',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db   = firebase.firestore();

// Maps level select values → Firestore level IDs (must match seeded data)
const LEVEL_IDS = {
  monde: 1, Europe: 2, UE: 3, Afrique: 4, Asie: 5, Amérique: 6, Océanie: 7,
};

const GAME_TYPE_CHRONO = 1;
const GAME_TYPE_LIBRE  = 2;
const DIFFICULTY       = 1;

let _currentUser = null;

auth.onAuthStateChanged(user => {
  _currentUser = user;
  if (typeof window.onFirebaseAuthChanged === 'function') {
    window.onFirebaseAuthChanged(user);
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function _newProfileId() {
  return db.collection('profiles').doc().id;
}

async function _createSelfProfile(uid, prenom, nom, avatarId, skinId = 1) {
  const profileId = _newProfileId();
  const now = new Date().toISOString();
  await db.collection('profiles').doc(profileId).set({
    prenom,
    nom,
    avatar_id:      avatarId,
    skin_id:        skinId,
    is_supervisor:  true,
    linked_uid:     uid,
    owner_uid:      uid,
    supervisors:    { [uid]: 'owner' },
    grade:          null,
    class_id:       null,
    created_at:     now,
  });
  return profileId;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

window.firebaseService = {
  getUser: () => _currentUser,

  signUp: async (email, password, prenom, nom, avatarId = 1) => {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const uid  = cred.user.uid;
    await cred.user.updateProfile({ displayName: prenom });

    const profileId = await _createSelfProfile(uid, prenom, nom, avatarId);

    await db.collection('users').doc(uid).set({
      uid,
      email,
      prenom,
      nom,
      role:        'solo',
      profile_ids: [profileId],
      created_at:  new Date().toISOString(),
    });

    return cred.user;
  },

  signIn:        (email, password) => auth.signInWithEmailAndPassword(email, password),
  signOut:       ()               => auth.signOut(),
  resetPassword: (email)          => auth.sendPasswordResetEmail(email),

  signInWithGoogle: async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const cred     = await auth.signInWithPopup(provider);
    const uid      = cred.user.uid;
    const userRef  = db.collection('users').doc(uid);
    const existing = await userRef.get();

    if (!existing.exists) {
      const parts  = (cred.user.displayName || '').split(' ');
      const prenom = parts[0] || '';
      const nom    = parts.slice(1).join(' ') || '';

      const profileId = await _createSelfProfile(uid, prenom, nom, 1);

      await userRef.set({
        uid,
        email:       cred.user.email || '',
        prenom,
        nom,
        role:        'solo',
        profile_ids: [profileId],
        created_at:  new Date().toISOString(),
      });
    }

    return cred.user;
  },

  // ─── Profils ───────────────────────────────────────────────────────────────

  getProfiles: async () => {
    if (!_currentUser) return [];
    const userDoc = await db.collection('users').doc(_currentUser.uid).get();
    if (!userDoc.exists) return [];
    const ids = userDoc.data().profile_ids || [];
    if (ids.length === 0) return [];
    const snaps = await Promise.all(ids.map(id => db.collection('profiles').doc(id).get()));
    return snaps
      .filter(s => s.exists)
      .map(s => ({ id: s.id, ...s.data() }));
  },

  createChildProfile: async (prenom, nom, avatarId = 1) => {
    if (!_currentUser) return null;
    const uid       = _currentUser.uid;
    const profileId = _newProfileId();
    const now       = new Date().toISOString();

    await db.collection('profiles').doc(profileId).set({
      prenom,
      nom,
      avatar_id:     avatarId,
      skin_id:       1,
      is_supervisor: false,
      linked_uid:    null,
      owner_uid:     uid,
      supervisors:   { [uid]: 'parent' },
      grade:         null,
      class_id:      null,
      created_at:    now,
    });

    await db.collection('users').doc(uid).update({
      profile_ids: firebase.firestore.FieldValue.arrayUnion(profileId),
      role:        'parent',
    });

    return profileId;
  },

  deleteChildProfile: async (profileId) => {
    if (!_currentUser) return;
    await db.collection('profiles').doc(profileId).delete();
    await db.collection('users').doc(_currentUser.uid).update({
      profile_ids: firebase.firestore.FieldValue.arrayRemove(profileId),
    });
  },

  getProfileById: async (profileId) => {
    const doc = await db.collection('profiles').doc(profileId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  updateProfileAvatar: (profileId, avatarId) => {
    if (!_currentUser) return Promise.resolve();
    return db.collection('profiles').doc(profileId).update({ avatar_id: avatarId });
  },

  updateProfileSkin: (profileId, skinId) => {
    if (!_currentUser) return Promise.resolve();
    return db.collection('profiles').doc(profileId).update({ skin_id: skinId });
  },

  // ─── Compte superviseur ────────────────────────────────────────────────────

  getSupervisorProvider: () => {
    if (!_currentUser) return null;
    return _currentUser.providerData[0]?.providerId || null;
  },

  reauthWithPassword: async (password) => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      _currentUser.email, password
    );
    return _currentUser.reauthenticateWithCredential(credential);
  },

  reauthWithGoogle: async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return _currentUser.reauthenticateWithPopup(provider);
  },

  getUserAccount: async () => {
    if (!_currentUser) return null;
    const doc = await db.collection('users').doc(_currentUser.uid).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  // ─── Scores & progression ─────────────────────────────────────────────────

  saveGame: async (profileId, { levelKey, timerEnabled, score, timeMs, won, poolSize, displayName }) => {
    if (!_currentUser || !profileId) return;
    const levelId    = LEVEL_IDS[levelKey] ?? 1;
    const gameTypeId = timerEnabled ? GAME_TYPE_CHRONO : GAME_TYPE_LIBRE;
    const maxScore   = poolSize * 1000;
    const ratio      = maxScore > 0 ? score / maxScore : 0;
    const stars      = !won ? 0 : ratio >= 0.7 ? 3 : ratio >= 0.4 ? 2 : 1;
    const now        = new Date().toISOString();

    const profileRef = db.collection('profiles').doc(profileId);

    await profileRef.collection('save_games').add({
      game_id:         1,
      game_type_id:    gameTypeId,
      level_id:        levelId,
      difficulty:      DIFFICULTY,
      score,
      time_ms:         timeMs,
      is_completed:    won,
      stars_collected: stars,
      items_collected: [],
      played_at:       now,
    });

    const progressKey = `${levelId}_${gameTypeId}_${DIFFICULTY}`;
    const progressRef = profileRef.collection('progress').doc(progressKey);
    const existing    = await progressRef.get();
    if (!existing.exists || score > existing.data().score) {
      await progressRef.set({
        level_id:     levelId,
        game_type_id: gameTypeId,
        difficulty:   DIFFICULTY,
        score,
        best_time:    timeMs,
        stars,
        completed:    won,
        display_name: displayName || '',
        date:         now,
        updated_at:   now,
      });
    }
  },

  getMyScores: async (profileId) => {
    if (!profileId) return [];
    const snap = await db.collection('profiles').doc(profileId)
      .collection('progress').get();
    return snap.docs.map(d => d.data());
  },

  getLevelLeaderboard: async (levelId) => {
    // Récupère les meilleurs scores tous profils confondus pour un niveau
    const snap = await db.collectionGroup('progress')
      .where('level_id', '==', levelId)
      .orderBy('score', 'desc')
      .limit(10)
      .get();
    return snap.docs.map(d => d.data());
  },

  // ─── Seed ─────────────────────────────────────────────────────────────────

  seedDatabase: async () => {
    const existing = await db.collection('games').doc('1').get();
    if (existing.exists) {
      console.log('Seed ignoré — données déjà présentes.');
      return;
    }

    const FAMILY_UUID = 'a1b2c3d4-0001-4000-8000-cliconmap0001';
    const now         = new Date().toISOString();
    const batch       = db.batch();

    batch.set(db.collection('games').doc('1'), {
      id: 1, name: 'Clic on Map',
      description: 'Jeu de géographie — trouvez les pays sur la carte du monde',
      version: '1.0',
    });

    batch.set(db.collection('game_types').doc('1'), { id: 1, game_id: 1, name: 'Classique',   notes: 'Avec chrono' });
    batch.set(db.collection('game_types').doc('2'), { id: 2, game_id: 1, name: 'Sans chrono', notes: 'Sans pénalité de temps' });

    batch.set(db.collection('level_families').doc('1'), {
      id: 1, uuid: FAMILY_UUID, game_id: 1,
      name: 'Carte du monde', notes: 'Planisphère SVG', date: now, author: 'system',
    });

    const LEVELS = [
      { id: 1, name: 'monde',    title: 'Monde entier'     },
      { id: 2, name: 'Europe',   title: 'Europe'           },
      { id: 3, name: 'UE',       title: 'Union Européenne' },
      { id: 4, name: 'Afrique',  title: 'Afrique'          },
      { id: 5, name: 'Asie',     title: 'Asie'             },
      { id: 6, name: 'Amérique', title: 'Amérique'         },
      { id: 7, name: 'Océanie',  title: 'Océanie'          },
    ];
    LEVELS.forEach(lvl => batch.set(db.collection('levels').doc(String(lvl.id)), {
      id: lvl.id, uuid: `b100000${lvl.id}-0001-4000-8000-cliconmap0001`,
      game_id: 1, family_id: 1, family_uuid: FAMILY_UUID,
      name: lvl.name, title: lvl.title, date: now, author: 'system',
    }));

    [
      { id: 1, name: 'Sombre'          },
      { id: 2, name: 'Coloré'          },
      { id: 3, name: 'Carte au trésor' },
      { id: 4, name: 'Multicolore'     },
    ].forEach(s => batch.set(db.collection('skins').doc(String(s.id)), s));

    await batch.commit();
    console.log('Seed OK.');
  },
};
