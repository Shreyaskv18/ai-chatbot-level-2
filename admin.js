// GOOGLE APPS SCRIPT WEB APP URL
const sheetURL = "https://script.google.com/macros/s/AKfycby5Rp-y1mPYhMas1etjNqttsyb3acO9dTQ3jREChOInouREB4ZrdYOueaAICzJMgMB2hA/exec";

let step = 0;
let name = "";
let phone = "";
let email = "";
let service = "";
let greeted = false;


// OPEN / CLOSE CHAT
function toggleChat(){

  const chatbox = document.getElementById("chatbox");

  if(chatbox.style.display === "block"){
    chatbox.style.display = "none";
  } 
  else{
    chatbox.style.display = "block";

    if(!greeted){
      showTyping();

      setTimeout(()=>{
        removeTyping();
        addBotMessage("Hello 👋 What is your name?");
        greeted = true;
      },1000);
    }
  }

}


// SEND MESSAGE
function sendMessage(){

  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if(message === "") return;

  addUserMessage(message);
  input.value = "";


  // STEP 0 → NAME
  if(step === 0){

    name = message;

    showTyping();

    setTimeout(()=>{
      removeTyping();
      addBotMessage("Great! Please enter your phone number.");
      step = 1;
    },1000);

    return;
  }


  // STEP 1 → PHONE
  if(step === 1){

    const phonePattern = /^[0-9]{10}$/;

    if(!phonePattern.test(message)){
      addBotMessage("⚠ Please enter a valid 10 digit phone number.");
      return;
    }

    phone = message;

    showTyping();

    setTimeout(()=>{
      removeTyping();
      addBotMessage("Please enter your email.");
      step = 2;
    },1000);

    return;
  }


  // STEP 2 → EMAIL
  if(step === 2){

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if(!emailPattern.test(message)){
      addBotMessage("⚠ Please enter a valid email address.");
      return;
    }

    email = message;

    showTyping();

    setTimeout(()=>{
      removeTyping();
      addBotMessage(
        "Which service are you interested in?\n\n1️⃣ Website Development\n2️⃣ Chatbot\n3️⃣ SEO"
      );
      step = 3;
    },1000);

    return;
  }


  // STEP 3 → SERVICE
  if(step === 3){

    if(message === "1"){
      service = "Website Development";
    }
    else if(message === "2"){
      service = "Chatbot";
    }
    else if(message === "3"){
      service = "SEO";
    }
    else{
      addBotMessage("Please type 1, 2 or 3.");
      return;
    }

    addBotMessage("Submitting your details...");
    sendToGoogleSheet();
    step = 4;
  }

}


// USER MESSAGE
function addUserMessage(text){

  const chatBody = document.getElementById("chatBody");

  const div = document.createElement("div");
  div.className = "user";
  div.textContent = text;

  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}


// BOT MESSAGE
function addBotMessage(text){

  const chatBody = document.getElementById("chatBody");

  const div = document.createElement("div");
  div.className = "bot";
  div.textContent = text;

  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}


// SHOW TYPING
function showTyping(){

  const chatBody = document.getElementById("chatBody");

  const typing = document.createElement("div");
  typing.className = "bot";
  typing.id = "typing";

  typing.innerText = "Assistant is typing...";

  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;

}


// REMOVE TYPING
function removeTyping(){

  const typing = document.getElementById("typing");

  if(typing){
    typing.remove();
  }

}


// SEND DATA TO GOOGLE SHEET
function sendToGoogleSheet(){

  const formData = new FormData();

  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("service", service);

  fetch(sheetURL,{
    method:"POST",
    body: formData
  })

  .then(res => res.text())
  .then(data => {

    addBotMessage("✅ Thank you! Our team will contact you shortly.");

    const whatsappMessage =
`Hello, my name is ${name}
Phone: ${phone}
Email: ${email}
Service: ${service}`;

    const whatsappURL =
      "https://wa.me/?text=" + encodeURIComponent(whatsappMessage);

    window.open(whatsappURL,"_blank");

  })

  .catch(err => {
    addBotMessage("❌ Error submitting form.");
    console.error(err);
  });

}