import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cards = JSON.parse(readFileSync(resolve(__dirname, '../approaches/all.json'), 'utf8'));

const firebaseConfig = {
  apiKey: 'AIzaSyDL4BzWgpuvlzT7JEDquFteFc_e3D7h6qU',
  authDomain: 'skyteam-approach-generator.firebaseapp.com',
  projectId: 'skyteam-approach-generator',
  storageBucket: 'skyteam-approach-generator.firebasestorage.app',
  messagingSenderId: '687743733818',
  appId: '1:687743733818:web:de0d2521f61664bf886503',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  let count = 0;
  for (const card of cards) {
    await setDoc(doc(db, 'approach_cards', card.id), card);
    console.log(`✓ ${card.titleAbbr} — ${card.titleFull}`);
    count++;
  }
  console.log(`\nSeeded ${count} approach cards.`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
