document.addEventListener('DOMContentLoaded', function () {
    const saveTemplateButton = document.getElementById('save-template-button');
    function checkTemplateTitle(templates, templateTitle){
        for (const template of templates) {
            if (template.title === templateTitle){
            return true;
            }
        }
        return false;  
        }
    saveTemplateButton.addEventListener('click', function () {
        const templateTitle = document.getElementById('template-title').value;
        const templateRole = document.getElementById('template-role').value;
        const templateTask = document.getElementById('template-task').value;
        const templateTone = document.getElementById('template-tone').value;
        const templateFormat = document.getElementById('template-format').value;
        const templateInput = document.getElementById('template-input').value;

        const newTemplate = {
            category: 'add-by-option',
            title: templateTitle,
            role: templateRole,
            task: templateTask,
            tone: templateTone,
            format: templateFormat,
            input: templateInput
        };
        
        chrome.storage.local.get('templates', function (data) {
            let templates = data.templates;
            if (!templates) {
                templates = [];
            }
            if (!checkTemplateTitle(templates, templateTitle)){
                templates.push(newTemplate);
                chrome.storage.local.set({ templates: templates }, function () {
                    window.close();
                });
            } else {
                alert('Template Name Already Taken');
            }
        });
    });
});
