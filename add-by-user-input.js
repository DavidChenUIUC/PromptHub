document.addEventListener('DOMContentLoaded', function () {
    function checkTemplateTitle(templates, templateTitle){
        for (const template of templates) {
            if (template.title === templateTitle){
            return true;
            }
        }
        return false;  
        }
    const saveTemplateButton = document.getElementById('save-template-button');
    saveTemplateButton.addEventListener('click', function () {
        const templateTitle = document.getElementById('template-title').value;
        const templateInput = document.getElementById('template-input').value;

        const newTemplate = {
            category: 'add-by-user-input',
            title: templateTitle,
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
