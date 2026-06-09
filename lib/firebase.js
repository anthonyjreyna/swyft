import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Paste your Firebase web config values here once the project is created.
// Until then the funnel still works end to end; leads just are not saved.
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

const configured =
  firebaseConfig.apiKey && firebaseConfig.apiKey.indexOf("REPLACE") === -1;

let db = null;
if (configured) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db };

export async function saveLead(data) {
  if (!db) return { ok: false, reason: "not-configured" };
  try {
    await addDoc(collection(db, "leads"), {
      ...data,
      createdAt: Date.now(),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}
