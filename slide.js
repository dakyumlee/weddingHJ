import { db } from './firebase.js';
import {
  collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const rsvpForm = document.querySelector(".rsvp-form");
const guestForm = document.querySelector(".guest-form");
const guestbook = document.getElementById("guestbook");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = rsvpForm.querySelector("input").value;
    const status = rsvpForm.querySelector("select").value;
    const message = rsvpForm.querySelector("textarea").value;

    await addDoc(collection(db, "rsvps"), {
      name,
      status,
      message,
      createdAt: serverTimestamp()
    });

    alert("참석 여부가 제출되었습니다!");
    rsvpForm.reset();
  });
}

if (guestForm) {
  guestForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = guestForm.querySelectorAll("input")[0].value;
    const message = guestForm.querySelector("textarea").value;
    const password = guestForm.querySelectorAll("input")[1].value;

    await addDoc(collection(db, "guestbook"), {
      name,
      message,
      password,
      createdAt: serverTimestamp()
    });

    alert("방명록이 등록되었습니다!");
    guestForm.reset();
    renderGuestbook();
  });
}

async function renderGuestbook() {
  guestbook.innerHTML = "";
  const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.style.marginBottom = "1rem";
    div.style.borderBottom = "1px solid #ccc";
    div.style.paddingBottom = "0.5rem";
    div.innerHTML = `
      <strong>${data.name}</strong><br/>
      <span>${data.message}</span><br/>
      <button onclick="deleteGuestbook('${docSnap.id}')">삭제</button>
    `;
    guestbook.appendChild(div);
  });
}

window.deleteGuestbook = async function(id) {
  const pw = prompt("비밀번호를 입력하세요");
  const docRef = doc(db, "guestbook", id);
  const snap = await getDocs(query(collection(db, "guestbook")));
  for (const docSnap of snap.docs) {
    if (docSnap.id === id) {
      if (docSnap.data().password === pw) {
        await deleteDoc(docRef);
        alert("삭제되었습니다!");
        renderGuestbook();
      } else {
        alert("비밀번호가 틀렸습니다.");
      }
      break;
    }
  }
}

if (guestbook) renderGuestbook();
