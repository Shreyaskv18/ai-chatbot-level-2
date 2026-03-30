// GOOGLE APPS SCRIPT WEB APP URL
const sheetURL = "https://script.google.com/macros/s/AKfycby5Rp-y1mPYhMas1etjNqttsyb3acO9dTQ3jREChOInouREB4ZrdYOueaAICzJMgMB2hA/exec";

let step = 0;
let name = "";
let phone = "";
let email = "";
let service = "";
let greeted = false;


// ENTER KEY SEND
document.getElementById("userInput").addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    e.preventDefault();
    sendMessage();
  }
});


// STRONG AUTO SCROLL FIX
function scrollDown(){
  const chatBody = document.getElementById("chatBody");

  requestAnimationFrame(()=>{
    chatBody.scrollTop = chatBody.scrollHeight;
  });

  setTimeout(()=>{
    chatBody.scrollTop = chatBody.scrollHeight;
  },50);
}



// OPEN / CLOSE CHAT
function toggleChat(){

  const chatbox = document.getElementById("chatbox");

  if(chatbox.style.display === "flex"){
    chatbox.style.display = "none";
  } 
  else{

    chatbox.style.display = "flex";

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


  // STEP 0 NAME
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


  // STEP 1 PHONE
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


  // STEP 2 EMAIL
  if(step === 2){

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;

    if(!emailPattern.test(message)){
      addBotMessage("⚠ Please enter a valid email address.");
      return;
    }

    email = message;

    showTyping();

    setTimeout(()=>{
      removeTyping();
      showServiceButtons();
      step = 3;
    },1000);

    return;
  }

}



// USER MESSAGE
function addUserMessage(text){

  const chatBody = document.getElementById("chatBody");

  const div = document.createElement("div");
  div.className = "user";
  div.textContent = text;

  chatBody.appendChild(div);

  scrollDown();
}



// BOT MESSAGE
function addBotMessage(text){

  const chatBody = document.getElementById("chatBody");

  const div = document.createElement("div");
  div.className = "bot";
  div.textContent = text;

  chatBody.appendChild(div);

  scrollDown();
}



// SHOW TYPING
function showTyping(){

  const chatBody = document.getElementById("chatBody");

  const div = document.createElement("div");
  div.className = "bot";
  div.id = "typing";
  div.innerText = "Assistant is typing...";

  chatBody.appendChild(div);

  scrollDown();
}



// REMOVE TYPING
function removeTyping(){

  const typing = document.getElementById("typing");

  if(typing){
    typing.remove();
  }
}



// SERVICE BUTTONS
function showServiceButtons(){

  const chatBody = document.getElementById("chatBody");

  const div = document.createElement("div");
  div.className = "bot";

  div.innerHTML = `
  Which service are you interested in?<br><br>

  <button onclick="selectService('Website Development')" class="serviceBtn">Website Development</button>

  <button onclick="selectService('Chatbot')" class="serviceBtn">Chatbot</button>

  <button onclick="selectService('SEO')" class="serviceBtn">SEO</button>
  `;

  chatBody.appendChild(div);

  scrollDown();
}



// SELECT SERVICE
function selectService(selected){

  service = selected;

  addUserMessage(selected);

  addBotMessage("Submitting your details...");

  sendToGoogleSheet();

  step = 4;
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

  .catch(err=>{
    addBotMessage("❌ Error submitting form.");
    console.error(err);
  });

}

