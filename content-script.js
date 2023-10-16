let injected = false;
let last_injected_template = '';

function generatePrefixFromOption(template) {
    let prefix = '';
    let role = '', task = '', tone = '', format = '', input = '';
    if (typeof template.role!==undefined){
        prefix+= 'You are now a ' + template.role;
    }
    if (template.task!==''){
        prefix+= ',and your task is to: ' + template.task;
    }
    if (template.format!==''){
        prefix+= ' in a ' + template.format+' format';
    }
    if (template.tone!==''){
        prefix+= ' with using a ' + template.tone+' tone.';
    }
    if (template.input!==''){
        prefix+= '\nThe content of the task is:' + template.input;
    }
    return prefix;
}
function generatePrefixFromUserInput(template) {
    console.log('generatePrefixFromUserInput', template);
    // let prefix = template;
    return template.input;
}

function injectTemplate(prefix) {
  const textarea = document.querySelector('textarea[tabindex="0"]');
  const inputText = textarea.value;
  if (textarea) {
      textarea.value = prefix + " " + inputText;
      console.log('textarea', textarea.value); 
      textarea.dispatchEvent(new Event('input', { bubbles: true })); 
  } else if(!textarea){
      console.log('User input not found in addPrefixToInput');
  }
}

function showMessage(message) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.padding = '10px';
    popup.style.backgroundColor = 'darkred';
    popup.style.color = 'white';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '9999';
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.remove();
    }, 3000);
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'check_injection_status') {
        const templateTitle = request.templateTitle;
        const textarea = document.querySelector('textarea[tabindex="0"]');
          console.log('Checking injection status', injected);
          console.log('textarea.value',textarea.value);
          console.log('textarea.value.length===0',textarea.value.length===0);
          if (templateTitle!== last_injected_template){
            sendResponse({ injected: false});
          }else{
            if(textarea.value.length===0){
                sendResponse({ injected: false});
          }else{
            sendResponse({ injected: true});
          }
        }   
          last_injected_template = templateTitle;
          return true;
      }else if (request.action === 'template_from_option') {
        // Generate the prefix based on the template and inject it into the page
        const templateTitle = request.templateTitle;
        const templateContent = request.templateContent;
        console.log(`template_from_option ${templateContent}`);
        const prefix = generatePrefixFromOption(templateContent);
        injectTemplate(prefix);
        // sendResponse({ injected: (templateTitle=== last_injected_template)});
    }else if (request.action === 'template_from_user_input') {
        const templateTitle = request.templateTitle;
        const templateContent = request.templateContent;
        console.log(`72template_from_user_input ${templateContent}`);
        console.log('templateContent', templateContent);
        const prefix = generatePrefixFromUserInput(templateContent);
        console.log(`104 templateContent ${templateContent}`);
        console.log(`105 prefix ${prefix}`);
        injectTemplate(prefix);
        // sendResponse({ injected: (templateTitle=== last_injected_template)});
    }else if (request.action === 'show_message') {
        showMessage(request.message);
    }
    return true;
  });
  