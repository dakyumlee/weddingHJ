import { db } from './firebase.js';
import {
  collection, addDoc, getDocs, serverTimestamp,
  query, orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const guestbookForm = document.getElementById('guestbook-form');
const guestbookList = document.getElementById('guestbook-list');
const ddayEl = document.getElementById('d-day');
const rsvpForm = document.getElementById('rsvp-form');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');

let currentSlide = 0;
const totalSlides = slides.length;

function updateDday() {
  const weddingDate = new Date('2026-03-22T13:30:00');
  const now = new Date();
  const diff = weddingDate - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (ddayEl) ddayEl.textContent = `D-${days > 0 ? days : 'Day'}`;
}

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert('복사되었습니다'))
    .catch(() => alert('복사 실패'));
}

rsvpForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('RSVP가 제출되었습니다. 감사합니다!');
  rsvpForm.reset();
});

async function loadGuestbook() {
  if (!guestbookList) return;
  guestbookList.innerHTML = '';

  const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const { name, message } = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `<strong>${name}</strong>: ${message}`;
    guestbookList.appendChild(li);
  });
}

guestbookForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = guestbookForm.querySelector('input')?.value.trim();
  const message = guestbookForm.querySelector('textarea')?.value.trim();
  if (!name || !message) return;

  await addDoc(collection(db, 'guestbook'), {
    name,
    message,
    timestamp: serverTimestamp()
  });

  guestbookForm.reset();
  loadGuestbook();
});

function updateSlide() {
  if (slider) slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlide();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlide();
  }
}

let startX = 0;
slider?.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});
slider?.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  const diffX = startX - endX;
  if (diffX > 50) nextSlide();
  else if (diffX < -50) prevSlide();
});

window.addEventListener('DOMContentLoaded', () => {
  updateDday();
  loadGuestbook();
});


window.copyText = copyText;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
