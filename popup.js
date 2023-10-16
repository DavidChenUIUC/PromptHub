document.addEventListener('DOMContentLoaded', function () {

  // Get button elements
  const addTemplatebyOptionButton = document.getElementById('add-by-option-button');
  const addTemplatebyUserInputButton = document.getElementById('add-by-user-input-button');
  const buttonContainer = document.getElementById('button-container');

  // Attach event listeners to the buttons
  addTemplatebyOptionButton.addEventListener('click', function () {
      chrome.windows.create({ 
          url: chrome.runtime.getURL('add-by-option.html'), 
          type: 'popup', 
          width: 500, 
          height: 600 
      });
  });

  addTemplatebyUserInputButton.addEventListener('click', function () {
      chrome.windows.create({ 
          url: chrome.runtime.getURL('add-by-user-input.html'), 
          type: 'popup', 
          width: 500, 
          height: 600 
      });
  });

  // Function to create a new template row
  function createTemplateRow(templateCategory, templateTitle, templateContent) {
      const templateRow = document.createElement('div');
      templateRow.classList.add('template-row');
  
      // Create and configure the title button
      const titleButton = document.createElement('button');
      titleButton.innerText = templateTitle;
      titleButton.classList.add('title-button');
      titleButton.addEventListener('click', function () {
          executeAction(templateCategory, templateTitle, templateContent);
      }); 
      
      // Create and configure the delete button
      const deleteButton = document.createElement('button');  // Changed 'dbutton' to 'button'
      deleteButton.innerText = '🗑️';
      deleteButton.addEventListener('click', function (e) {
          e.stopPropagation();
          chrome.storage.local.get('templates', function (data) {
              let templates = data.templates;
              templates = templates.filter(t => t.title !== templateTitle);
              chrome.storage.local.set({ 'templates': templates }, function () {
                  console.log('Template deleted:', templateTitle);
                  templateRow.remove();
              });
          });
      });
  
      // Append buttons to the template row
      templateRow.appendChild(titleButton);
      templateRow.appendChild(deleteButton);
      return templateRow;
  }

  // Retrieve templates and display them
  chrome.storage.local.get('templates', function (data) {
      let templates = data.templates || [];
      for (const template of templates) {
          const title = template.title;
          const content = template.category === 'add-by-option' ? 
              {
                  role: template.role,
                  task: template.task,
                  tone: template.tone,
                  format: template.format,
                  input: template.input
              } : { input: template.input };
          const row = createTemplateRow(template.category, title, content);
          buttonContainer.appendChild(row);
      }
  });

  // Function to execute an action based on the template
  function executeAction(category, templateTitle, templateContent) {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content-script.js']
          }, () => {
              chrome.tabs.sendMessage(tab.id, { 
                  action: 'check_injection_status', 
                  templateTitle: templateTitle 
              }, (response) => {
                  if (chrome.runtime.lastError) {
                      console.error(`Could not send message to tab ${tab.id}: ${chrome.runtime.lastError.message}`);
                  } else {
                      const actionType = category === 'add-by-option' ? 
                          'template_from_option' : 'template_from_user_input';

                      if (response === undefined || response.injected === false) {
                          chrome.tabs.sendMessage(tab.id, { 
                              action: actionType, 
                              templateTitle: templateTitle, 
                              templateContent: templateContent 
                          });
                      } else {
                          chrome.tabs.sendMessage(tab.id, { 
                              action: 'show_message', 
                              message: 'Template Has Applied' 
                          });
                      }
                  }
              });
          });
      });
  }
});
