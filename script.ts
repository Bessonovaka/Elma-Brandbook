/* Client scripts module */
declare const console: any;
declare const document: any;
declare const window: any;

interface IAllFields {
    id: number,
    name: string,
    type: string,
    value: string,
    dependencies?: {
        id: number,
        operator: string,
        value: string
    } | undefined
}

class Form {

    form: any;
    form_container: any;
    side_bar: string;

    constructor() {        
        this.form = document.querySelector(".form");
        this.form_container = document.querySelector(".form__container");
        this.form_container.classList.add('form-dnd')
        new FormFieldDnD(this.form_container);
        this.form.style.visibility = "visible";
    }

    setSideBarValue(side_bar = 'no') { 

        this.form_container.innerHTML='';

        let left_column = document.createElement("div");
        let rigth_column = document.createElement("div");

        // Добавляем кнопки
        const basic_block = document.createElement('div');

        const btn_basic = document.createElement('button');
        btn_basic.className = "btn btn-primary delete-on-export btn-basic";
        btn_basic.textContent = 'Добавить разметку';

        btn_basic.style.margin = '0 auto auto 0'

        btn_basic.addEventListener('click', () => {
            Context.data.show_main_area_settings_block = true;
            Context.data.block_id = `basic-div`;
        })

        const btn_tabs = document.createElement('button');
        btn_tabs.className = "btn btn-primary delete-on-export btn-tabs";
        btn_tabs.textContent = 'Добавить вкладки';

        btn_tabs.style.margin = '0 auto auto 1rem'

        btn_tabs.addEventListener('click', () => {
            Context.data.show_tabs_modal = true;
        })

        const basic_div = document.createElement('div');
        basic_div.className = "basic-div";
        basic_div.id = "basic-div";

        basic_block.appendChild(btn_basic)
        basic_block.appendChild(btn_tabs)
        basic_block.appendChild(basic_div)
        
        const btn = document.createElement('button');
        btn.className = "btn btn-primary delete-on-export add-block";
        btn.textContent = 'Добавить блок';

        btn.addEventListener('click', () => {
            Context.data.show_side_bar_options = true;
        })

        switch(side_bar) {
            case 'rigth':
                this.form_container.classList.add('form__container--rigth');
                
                left_column.classList.add('form-column');
                left_column.classList.add('form-column--basic');
                left_column.classList.add('form-column--75');
                this.form_container.appendChild(left_column);

                left_column.appendChild(basic_block);
                
                rigth_column.classList.add('form-column');
                rigth_column.classList.add('side-bar');
                rigth_column.classList.add('form-column--25');
                this.form_container.appendChild(rigth_column);

                rigth_column.appendChild(btn); 
                rigth_column.setAttribute('id', 'block_12345')
                this.addBtn(rigth_column, 12345, 'Добавить кастомный элемент', 'show_modal_custom');               
        
                break;
            case 'left':
                this.form_container.classList.add('form__container--left');

                left_column.classList.add('form-column');
                left_column.classList.add('side-bar');
                left_column.classList.add('form-column--25');
                this.form_container.appendChild(left_column);

                rigth_column.appendChild(basic_block);

                rigth_column.classList.add('form-column');
                rigth_column.classList.add('form-column--basic');
                rigth_column.classList.add('form-column--75');
                this.form_container.appendChild(rigth_column);

                left_column.appendChild(btn);
                left_column.setAttribute('id', 'block_12345')
                this.addBtn(left_column, 12345, 'Добавить кастомный элемент', 'show_modal_custom'); 

                break;
            default:
                this.form_container.appendChild(basic_block)
        } 
    }

    addTabs() {
        // Создаем основной контейнер tabset
        const elmaTabset = document.createElement('elma-tabset');

        elmaTabset.className = 'ng-star-inserted';

        // Создаем список вкладок (tablist)
        const tabList = document.createElement('ul');
        tabList.setAttribute('role', 'tablist');
        tabList.className = 'nav nav-tabs justify-content-start ng-star-inserted';
        tabList.setAttribute('tabs-cnt', Context.data.tabs_cnt!);
        const tabs_names = Context.data.tabs_names ? Context.data.tabs_names.split(', ') : '';

        // Создаем вкладки
        for (let i=0; i<Context.data.tabs_cnt!; i++) {
            const tabItem = document.createElement('li');
            tabItem.className = 'nav-item ng-star-inserted';
            tabItem.setAttribute('data-draggable', 'true');

            const tabLink = document.createElement('a');
            tabLink.setAttribute('role', 'tab');
            tabLink.className = i == 0 ? 'nav-link ng-star-inserted active' : 'nav-link ng-star-inserted';
            tabLink.id = 'elma-tab-2' + i;
            tabLink.setAttribute('aria-controls', `elma-tab-2${i}-panel`);
            tabLink.setAttribute('aria-expanded', 'false');
            tabLink.setAttribute('aria-disabled', 'false');
            tabLink.textContent = tabs_names[i] ? tabs_names[i] : `Вкладка ${i+1}`;

            tabLink.addEventListener('click', () => {
                document.querySelectorAll(".nav-link").forEach((tab: any) => {
                    tab.className = 'nav-link ng-star-inserted';
                });

                tabLink.className = 'nav-link ng-star-inserted active';

                document.querySelectorAll(".tab-panel").forEach((tab: any) => {
                    tab.classList.remove('active');
                });

                document.getElementById(`elma-tab-2${i}-panel`).classList.add('active');
            })

            tabItem.appendChild(tabLink);
            tabList.appendChild(tabItem);
        }

        // Добавляем список вкладок в основной контейнер
        elmaTabset.appendChild(tabList);

        // Создаем контейнер для содержимого вкладок
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';

        const tabContentWrapper = document.createElement('div');
        tabContentWrapper.className = 'tab-content-wrapper';

        // Создаем содержимое вкладок
        for (let i=0; i<Context.data.tabs_cnt!; i++) {
            const tabPanel = document.createElement('elma-tab');
            tabPanel.setAttribute('role', 'tabpanel');
            tabPanel.id = `elma-tab-2${i}-panel`;
            tabPanel.setAttribute('aria-labelledby', 'elma-tab-2' + i);
            tabPanel.setAttribute('aria-expanded', 'true');
            tabPanel.className = i == 0 ? 'tab-panel ng-star-inserted active' : 'tab-panel ng-star-inserted';

            const modalBody = document.createElement('elma-modal-body');
            modalBody.className = 'modal-body ng-star-inserted';

            // Добавляем кнопки
            const basic_block = document.createElement('div');
            basic_block.id = `basic_block_${i+1}`

            const btn_basic = document.createElement('button');
            btn_basic.className = "btn btn-primary delete-on-export btn-basic-grid";
            btn_basic.textContent = 'Добавить разметку';

            btn_basic.style.margin = '0 auto auto 0'

            btn_basic.addEventListener('click', () => {
                Context.data.show_main_area_settings_block = true;
                Context.data.block_id = `basic_block_${i+1}`
            })

            const div = document.createElement('div');

            basic_block.appendChild(btn_basic)
            basic_block.appendChild(div)

            modalBody.appendChild(basic_block);
            tabPanel.appendChild(modalBody);
            tabContentWrapper.appendChild(tabPanel);
        }

        // Добавляем обертки в основной контейнер
        tabContent.appendChild(tabContentWrapper);
        elmaTabset.appendChild(tabContent);

        // Теперь элемент elmaTabset можно добавить в DOM
        const basic_div = document.querySelector(".basic-div"); // Нашли блок, в который нужно вставить разметку
        basic_div.appendChild(elmaTabset);        

        // Добавляем кнопку удвления элемента
        this.addDelBtn(elmaTabset, 'tabs', basic_div);
    }

    createBool(label: string, clue: string | undefined, yes="Да", no="Нет") {
        // Создаем основной элемент формы
        const formRow = document.createElement('elma-form-row');

        formRow.className = 'elma-form-row ng-untouched ng-valid ng-star-inserted @compact ng-dirty custom-switch draggable-el';

        // Создаем элемент метки
        const formLabel = document.createElement('elma-form-label');
        formLabel.className = 'elma-form-label ng-star-inserted';

        // Создаем текст метки
        const labelSpan = document.createElement('span');
        labelSpan.className = 'label-name';
        labelSpan.textContent = label;

        // Добавляем элементы в метку
        formLabel.appendChild(labelSpan);

        // Добавляем метку в строку формы
        formRow.appendChild(formLabel);

        // Создаем элемент управления формой
        const formControl = document.createElement('elma-form-control');
        formControl.className = 'elma-form-control text-base';

        // Создаем элемент типа boolean
        const typeBoolean = document.createElement('elma-type-boolean');
        typeBoolean.className = 'ng-star-inserted';

        // Создаем переключатель
        const elmaSwitch = document.createElement('elma-switch');
        elmaSwitch.className = 'ng-untouched ng-valid ng-star-inserted ng-dirty';
        elmaSwitch.tabIndex = 0;

        // Создаем контейнер для кнопок переключателя
        const switchButtons = document.createElement('div');
        switchButtons.className = 'switch-buttons';

        // Создаем selectbutton
        const pSelectButton = document.createElement('p-selectbutton');
        pSelectButton.className = 'p-element';

        // Создаем основную обертку для кнопок
        const selectButtonDiv = document.createElement('div');
        selectButtonDiv.setAttribute('role', 'group');
        selectButtonDiv.setAttribute('data-pc-name', 'selectbutton');
        selectButtonDiv.setAttribute('data-pc-section', 'root');
        selectButtonDiv.className = 'p-selectbutton p-buttonset p-component';

        // Создаем кнопку "Да" (активную)
        const yesButton = document.createElement('div');
        yesButton.setAttribute('pripple', '');
        yesButton.setAttribute('pautofocus', '');
        yesButton.className = 'p-ripple p-element p-button p-component ng-star-inserted p-highlight yes-btn';
        yesButton.setAttribute('role', 'radio');
        yesButton.tabIndex = 0;
        yesButton.setAttribute('aria-label', 'Да');
        yesButton.setAttribute('aria-checked', 'true');
        yesButton.setAttribute('aria-labelledby', 'Да');
        yesButton.setAttribute('data-pc-section', 'button');

        // Создаем текст кнопки "Да"
        const yesLabel = document.createElement('span');
        yesLabel.className = 'p-button-label ng-star-inserted';
        yesLabel.setAttribute('data-pc-section', 'label');
        yesLabel.textContent = yes;

        // Добавляем элементы в кнопку "Да"
        yesButton.appendChild(yesLabel);

        // Создаем кнопку "Нет" (неактивную)
        const noButton = document.createElement('div');
        noButton.setAttribute('pripple', '');
        noButton.setAttribute('pautofocus', '');
        noButton.className = 'p-ripple p-element p-button p-component ng-star-inserted no-btn';
        noButton.setAttribute('role', 'radio');
        noButton.tabIndex = -1;
        noButton.setAttribute('aria-label', 'Нет');
        noButton.setAttribute('aria-checked', 'false');
        noButton.setAttribute('aria-labelledby', 'Нет');
        noButton.setAttribute('data-pc-section', 'button');

        // Создаем текст кнопки "Нет"
        const noLabel = document.createElement('span');
        noLabel.className = 'p-button-label ng-star-inserted';
        noLabel.setAttribute('data-pc-section', 'label');
        noLabel.textContent = no;

        // Добавляем элементы в кнопку "Нет"
        noButton.appendChild(noLabel);

        // Добавляем кнопки в обертку
        selectButtonDiv.appendChild(yesButton);
        selectButtonDiv.appendChild(noButton);

        // Добавляем обертку в selectbutton
        pSelectButton.appendChild(selectButtonDiv);

        // Добавляем selectbutton в контейнер кнопок
        switchButtons.appendChild(pSelectButton);

        // Добавляем контейнер кнопок в переключатель
        elmaSwitch.appendChild(switchButtons);

        // Добавляем переключатель в тип boolean
        typeBoolean.appendChild(elmaSwitch);

        // Добавляем тип boolean в элемент управления
        formControl.appendChild(typeBoolean);
        formControl.appendChild(document.createComment(''));

        // Добавляем элемент управления в строку формы
        formRow.appendChild(formControl);

        // Добавляем элемент в DOM
        const block = document.querySelector(`#${Context.data.block_id}`);

        if (clue) { // Подсказка
            block.appendChild(this.createTooltip(formRow, clue));
        } else {
            block.appendChild(formRow);
        }

        // Добавляем кнопку удаления элемента
        this.addDelBtn(formRow, 'field', block);

        yesButton.addEventListener('click', () => {
            yesButton.classList.add('p-highlight');
            yesButton.setAttribute('aria-checked', 'true');
            noButton.classList.remove('p-highlight');
            noButton.setAttribute('aria-checked', 'false');
        });

        noButton.addEventListener('click', () => {
            noButton.classList.add('p-highlight');
            noButton.setAttribute('aria-checked', 'true');
            yesButton.classList.remove('p-highlight');
            yesButton.setAttribute('aria-checked', 'false');
        });
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
    }

    createFlag(label: string, clue: string | undefined) {
        // Создаем основной контейнер
        const itemScopeItem = document.createElement('div');

        itemScopeItem.className = 'itemscope__item ng-star-inserted draggable-el';

        // Создаем элемент elma-checkbox
        const elmaCheckbox = document.createElement('elma-checkbox');
        elmaCheckbox.className = 'ng-untouched ng-pristine ng-valid';

        // Создаем p-checkbox элемент
        const pCheckbox = document.createElement('p-checkbox');
        pCheckbox.className = 'p-element';

        // Создаем основной div чекбокса
        const checkboxDiv = document.createElement('div');
        checkboxDiv.setAttribute('data-pc-name', 'checkbox');
        checkboxDiv.setAttribute('data-pc-section', 'root');
        checkboxDiv.className = 'p-checkbox p-component';

        // Создаем скрытый input
        const hiddenDiv = document.createElement('div');
        hiddenDiv.className = 'p-hidden-accessible';
        hiddenDiv.setAttribute('data-pc-section', 'hiddenInputWrapper');
        hiddenDiv.setAttribute('data-p-hidden-accessible', 'true');

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'checkbox';
        hiddenInput.setAttribute('pautofocus', '');
        hiddenInput.className = 'p-element';
        hiddenInput.value = 'undefined';
        hiddenInput.name = '';
        hiddenInput.tabIndex = 0;
        hiddenInput.setAttribute('aria-checked', 'false');
        hiddenInput.setAttribute('data-pc-section', 'hiddenInput');

        hiddenDiv.appendChild(hiddenInput);

        // Создаем визуальную часть чекбокса
        const checkboxBox = document.createElement('div');
        checkboxBox.className = 'p-checkbox-box';
        checkboxBox.setAttribute('data-p-highlight', 'false');
        checkboxBox.setAttribute('data-p-disabled', 'false');
        checkboxBox.setAttribute('data-p-focused', 'false');
        checkboxBox.setAttribute('data-pc-section', 'input');
        checkboxBox.appendChild(document.createComment(''));

        // Создаем label для чекбокса
        const checkboxLabel = document.createElement('label');
        checkboxLabel.setAttribute('data-pc-section', 'label');
        checkboxLabel.className = 'p-checkbox-label ng-star-inserted';
        checkboxLabel.textContent = label;

        // Собираем структуру чекбокса
        checkboxDiv.appendChild(hiddenDiv);
        checkboxDiv.appendChild(checkboxBox);
        checkboxDiv.appendChild(checkboxLabel);
        checkboxDiv.appendChild(document.createComment(''));

        // Добавляем чекбокс в p-checkbox
        pCheckbox.appendChild(checkboxDiv);

        // Добавляем p-checkbox в elma-checkbox
        elmaCheckbox.appendChild(pCheckbox);

        // Добавляем elma-checkbox в основной контейнер
        itemScopeItem.appendChild(elmaCheckbox);

        // Добавляем элемент в DOM
        const block = document.querySelector(`#${Context.data.block_id}`);

        // Добавляем кнопку удвления элемента
        this.addDelBtn(itemScopeItem, 'field', block);

        if (clue) { // Подсказка
            block.appendChild(this.createTooltip(itemScopeItem, clue));
        } else {
            block.appendChild(itemScopeItem);
        }
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
    }

    createField(form_type: string, label: string, clue: string | undefined) {
        // Создаем основной элемент elma-form-row
        const formRow = document.createElement('elma-form-row');

        formRow.className = 'elma-form-row ng-untouched ng-pristine ng-star-inserted ng-invalid draggable-el';

        // Создаем элемент elma-form-label
        const formLabel = document.createElement('elma-form-label');
        formLabel.className = 'elma-form-label ng-star-inserted';

        // Создаем span с названием поля
        const labelSpan = document.createElement('span');
        labelSpan.className = 'label-name';
        labelSpan.textContent = label;

        // Добавляем span элементы в formLabel
        formLabel.appendChild(labelSpan);

        // Создаем span с символом обязательности (*)
        if (Context.data.is_required_field) {
            const requiredSpan = document.createElement('span');
            requiredSpan.className = 'required ng-star-inserted';
            requiredSpan.textContent = '*';
            formLabel.appendChild(requiredSpan);
        }

        // Добавляем formLabel в formRow
        formRow.appendChild(formLabel);

        // Создаем элемент elma-form-control
        const formControl = document.createElement('elma-form-control');
        formControl.className = 'elma-form-control text-base';

        // Создаем input-group
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        // Создаем p-autocomplete
        const pAutocomplete = document.createElement('p-autocomplete');
        pAutocomplete.setAttribute('style', 'width: 100%;');
        pAutocomplete.className = 'p-element p-inputwrapper';

        // Создаем div для p-autocomplete
        const pAutocompleteDiv = document.createElement('div');
        pAutocompleteDiv.className = 'p-autocomplete p-component p-inputwrapper';

        // Создаем input элемент
        const input = document.createElement('input');
        input.setAttribute('pautofocus', '');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('role', 'combobox');
        input.className = 'p-element p-autocomplete-input p-inputtext p-component ng-star-inserted';
        input.setAttribute('type', 'text');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('name', 'undefined');
        input.setAttribute('tabindex', '0');
        input.setAttribute('value', Context.data.value ? Context.data.value : '');
        input.setAttribute('size', 'NaN');
        input.setAttribute('aria-required', 'false');
        input.setAttribute('aria-expanded', 'false');
        
        if (form_type=="file") {
            input.style.border = "2px dashed #f0f0f0";
            input.setAttribute('placeholder', '+ Файл');
        }

        // Добавляем элементы в p-autocompleteDiv
        pAutocompleteDiv.appendChild(input);

        // Добавляем p-autocompleteDiv в p-autocomplete
        pAutocomplete.appendChild(pAutocompleteDiv);

        // Добавляем элементы в inputGroup
        inputGroup.appendChild(pAutocomplete);
        
        // Добавляем typeCollection в formControl
        formControl.appendChild(inputGroup);

        // Создаем кнопку 
        const btn = document.createElement('button');
        if (form_type != "text" && form_type != "string" && form_type != "file") {
            btn.setAttribute('type', 'button');
            btn.setAttribute('style', 'background: #fff !important; width: 2.4rem; height: 2.4rem; margin: auto auto auto -2.5rem; z-index: 1000;')
            inputGroup.appendChild(btn);
        }

        if (form_type == "basic") {
            
            input.setAttribute('placeholder', 'Начните вводить текст для поиска элемента');
            
            btn.setAttribute('tabindex', '-1');
            btn.className = 'input-group-search md-18 btn btn-default btn-style-icon elma-icons ng-star-inserted search-btn';
            btn.setAttribute('title', 'Расширенный поиск');
            btn.textContent = 'search ';
        }

        if (form_type == "text") {
            
            input.style.minHeight = "9.4rem";
        }

        if (form_type == "category") {
            
            btn.textContent = 'arrow_down ';
            btn.className = 'toggler btn btn-default btn-style-icon elma-icons ng-star-inserted';
        }

        if (form_type == "date") {
            
            btn.setAttribute('aria-haspopup', 'dialog');
            btn.setAttribute('pbutton', '');
            btn.setAttribute('pripple', '');
            btn.tabIndex = 0;
            btn.className = 'p-element p-ripple p-datepicker-trigger p-button-icon-only ng-tns-c1685646730-57 p-button p-component ng-star-inserted';
            btn.setAttribute('aria-label', 'Choose Date');
            btn.setAttribute('aria-expanded', 'false');

            // Создаем иконку календаря
            const calendarIcon = document.createElement('span');
            calendarIcon.setAttribute('_ngcontent-ng-c1929920651', '');
            calendarIcon.className = 'elma-icons icon-calendar ng-star-inserted';

            // Добавляем иконку в кнопку
            btn.appendChild(calendarIcon);

            inputGroup.style.width = "13rem";

        }

        if (clue && !Context.data.tooltip) {
            const elmaClue = document.createElement('div');
            elmaClue.classList.add("elma-clue");
            elmaClue.textContent = clue;
            formControl.appendChild(elmaClue);
        }
        
        // Добавляем formControl в formRow
        formRow.appendChild(formControl);

        const block = document.querySelector(`#${Context.data.block_id}`);

        // Добавляем кнопку удвления элемента
        this.addDelBtn(formRow, 'field', block);

        if (clue && Context.data.tooltip) { // Подсказка-тултип
            block.appendChild(this.createTooltip(formRow, clue));
        } else {
            block.appendChild(formRow);
        }
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
         
    }

    createUserField(block?: any) {
        // Создаем основной контейнер
        const elmaTypeUser = document.createElement('elma-type-user');

        elmaTypeUser.setAttribute('_nghost-ng-c1400498401', '');
        elmaTypeUser.className = 'ng-star-inserted draggable-el';

        // Создаем div с классом readonly-container
        const readonlyContainer = document.createElement('div');
        readonlyContainer.setAttribute('_ngcontent-ng-c1400498401', '');
        readonlyContainer.className = 'readonly-container ng-star-inserted';

        // Создаем app-user элемент
        const appUser = document.createElement('app-user');
        appUser.setAttribute('_ngcontent-ng-c1400498401', '');
        appUser.setAttribute('_nghost-ng-c119320726', '');
        appUser.className = 'ng-star-inserted';
        appUser.style.display = "flex";
        appUser.style.alignItems = "center";

        // Создаем user-card div
        const userCard = document.createElement('div');
        userCard.setAttribute('_ngcontent-ng-c119320726', '');
        userCard.className = 'user-card ng-star-inserted';

        // Создаем app-user-photo элемент
        const appUserPhoto = document.createElement('app-user-photo');
        appUserPhoto.innerHTML = `
            <svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="pattern_115_230" patternContentUnits="objectBoundingBox" width="1.000000" height="1.000000">
                        <use xlink:href="#image115_23_0" transform="matrix(0.003472,0,0,0.003472,0,0)"/>
                    </pattern>
                    <image id="image115_23_0" width="288.000000" height="288.000000" xlink:href="data:image/png;base64,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"/>
                </defs>
                <rect id="unnamed" rx="12.000000" width="24.000000" height="24.000000" fill="url(#pattern_115_230)" fill-opacity="1.000000"/>
            </svg>
        `
        appUserPhoto.style.marginRight = "0.7rem"

        // Создаем div с информацией о пользователе
        const userCardInfo = document.createElement('div');
        userCardInfo.setAttribute('_ngcontent-ng-c119320726', '');
        userCardInfo.className = 'user-card__info user-card__info-padding-sm ng-star-inserted';

        // Создаем блок с именем пользователя
        const userNameBlock = document.createElement('div');
        userNameBlock.setAttribute('_ngcontent-ng-c119320726', '');
        userNameBlock.className = 'user-name-block';

        // Создаем app-user-name элемент
        const appUserName = document.createElement('app-user-name');
        appUserName.setAttribute('_ngcontent-ng-c119320726', '');
        appUserName.setAttribute('_nghost-ng-c1257378518', '');

        // Создаем span с именем пользователя
        const userNameSpan = document.createElement('span');
        userNameSpan.setAttribute('_ngcontent-ng-c1257378518', '');
        userNameSpan.className = 'user-name ng-star-inserted';
        userNameSpan.textContent = 'Фамилия Имя';
        userNameSpan.style.borderBottom = "1px dashed #262626";

        // Добавляем span в app-user-name
        appUserName.appendChild(userNameSpan);

        // Добавляем app-user-name в userNameBlock
        userNameBlock.appendChild(appUserName);

        // Добавляем userNameBlock в userCardInfo
        userCardInfo.appendChild(userNameBlock);

        // Добавляем userCardInfo в userCard
        userCard.appendChild(userCardInfo);

        // Добавляем appUserPhoto и userCard в appUser
        appUser.appendChild(appUserPhoto);
        appUser.appendChild(userCard);

        // Добавляем appUser в readonlyContainer
        readonlyContainer.appendChild(appUser);

        // Добавляем readonlyContainer в elmaTypeUser
        elmaTypeUser.appendChild(readonlyContainer);

        // Добавляем созданный элемент в DOM
        block ? block.appendChild(elmaTypeUser) : document.querySelector(`#${Context.data.block_id}`).appendChild(elmaTypeUser);

        // Добавляем кнопку удаления элемента
        this.addDelBtn(elmaTypeUser, 'field', block ? block.appendChild(elmaTypeUser) : document.querySelector(`#${Context.data.block_id}`).appendChild(elmaTypeUser));
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
        
    }

    createBtn(btn_type: string, text: string) {
        const btnContainer = document.createElement("div")
        const btn = document.createElement("button");

        btnContainer.appendChild(btn);
        btnContainer.style.display = "flex";

        btn.textContent = text;
        btn.className = `btn btn-${btn_type} draggable-el`;
        btn.style.margin = "0.5rem";

        // Позиционируем кнопку
        switch(Context.data.btn_position!.code) {
            case 'center':
                btn.style.margin = "0 auto";
                break;
            case 'left':
                btn.style.margin = "0 auto 0 0";
                break;
            case 'right':
                btn.style.margin = "0 0 0 auto";
                break;
        }

        const block = document.querySelector(`#${Context.data.block_id}`);
        block.appendChild(btnContainer);

        // Добавляем кнопку удаления элемента
        this.addDelBtn(btnContainer, 'btn', block);
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
    }

    addGrid() {
    
        Context.data.show_main_area_settings_block = false;

        const basic_div = document.getElementById(Context.data.block_id); // Нашли блок, в который нужно вставить разметку

        const grid = document.createElement("div")

        grid.className = 'draggable-el' 

        grid.style.display = "grid";
        grid.style.overflow = 'auto';
        grid.style.marginBottom = "1rem";
        grid.style.gridTemplateColumns = Context.data.column_width == "1fr" ? `repeat(${Context.data.columns_cnt}, 1fr)` : Context.data.column_width;
        grid.style.gridGap = `${Context.data.grid_gap}rem`;

        for (let i=0; i < Context.data.columns_cnt!; i++) {
            const form_column__area = document.createElement("div");
            
            form_column__area.classList.add('form_column__area');

            const random = Math.round(Math.random()*100000);
            form_column__area.setAttribute("id", `block_${random}`);

            this.addBtns(form_column__area, random)

            grid.appendChild(form_column__area)

        }

        if (Context.data.is_panel) { // Не разметка, а панель
            // Создаем основной контейнер elma-groupbox
            const groupbox = document.createElement('div');
            groupbox.classList.add("panel");

            if (Context.data.panel_background) {
                switch (Context.data.panel_background.code) {
                    case 'blue':
                        groupbox.classList.add("panel--blue");
                        break;
                    case 'brown':
                        groupbox.classList.add("panel--brown");
                        break;
                    default:
                        groupbox.classList.add("panel--white");
                }
            } else {
                groupbox.classList.add("panel--white");
            }

            // Создаем заголовок группы
            const headerDiv = document.createElement('div');
            headerDiv.className = 'groupbox-header h3';

            // Создаем span с текстом заголовка
            const headerSpan = document.createElement('span');
            headerSpan.className = 'ng-star-inserted';
            headerSpan.textContent = Context.data.panel_name;

            // Создаем кнопку-тогглер
            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggler btn btn-default btn-style-icon elma-icons ng-star-inserted';
            toggleButton.textContent = 'arrow_up';

            toggleButton.addEventListener('click', (e: any) => {
                toggleButton.textContent = toggleButton.textContent == 'arrow_down' ? "arrow_up" : "arrow_down";
                grid.style.display = grid.style.display == 'none' ? "block" : "none";
            })

            // Добавляем элементы в заголовок
            headerDiv.appendChild(headerSpan);
            headerDiv.appendChild(toggleButton);

            // Добавляем заголовок и тело в основной контейнер
            groupbox.appendChild(headerDiv);
            groupbox.appendChild(grid);

            basic_div.appendChild(groupbox);

            // Добавляем кнопку удвления элемента
            this.addDelBtn(groupbox, 'grid', basic_div);
        } else {
            basic_div.appendChild(grid);

            // Добавляем кнопку удаления элемента
            this.addDelBtn(grid, 'grid', basic_div);
        }
        
        // Инициализация перетаскивания
        basic_div.classList.add('form-dnd')
        new FormFieldDnD(basic_div);
    }

    addBlock() {
        Context.data.show_side_bar_options = false;

        const random = Math.round(Math.random()*100000)
        const id = `block_${random}`

        const side_bar = document.querySelector(".side-bar"); 
        const side_bar_block = document.createElement('div');

        // Добавляем кнопку удвления элемента
        this.addDelBtn(side_bar_block, 'block', side_bar);

        side_bar_block.className = "side-bar__block draggable-el";
        side_bar_block.setAttribute('id', id); 

        // Создаем header группы
        const side_bar_block_header = document.createElement('div');
        side_bar_block_header.className = 'groupbox-header h3';
        side_bar_block_header.style.marginBottom = "1rem";

        const headerSpan = document.createElement('span');
        headerSpan.textContent = Context.data.block_name;

        side_bar_block_header.appendChild(headerSpan);
        side_bar_block.appendChild(side_bar_block_header);

        // Создаем body группы
        const side_bar_block_body = document.createElement('div');
        side_bar_block_body.className = 'groupbox-body zone-items-container';

        side_bar_block.appendChild(side_bar_block_body);

        side_bar.appendChild(side_bar_block);

        switch (Context.data.block_type!.code) {
            case 'basic':
                // Добавляем кнопки
                this.addBtns(side_bar_block_body, random);
                break;
            case 'observers':
                this.createUserField(side_bar_block);
                const btn = document.createElement('button');
                btn.className = "btn btn-primary";
                btn.textContent = 'Добавить наблюдателя';
                btn.style.margin = "1rem 0";
                side_bar_block.appendChild(btn);
                headerSpan.textContent = 'Наблюдатели';
        }   
        
        // Инициализация перетаскивания
        side_bar.classList.add('form-dnd')
        new FormFieldDnD(side_bar);     
    }

    addTable() {
        const tableContainer = document.createElement("div");
        // Создаём таблицу
        const table = document.createElement("table");
        tableContainer.appendChild(table);
        table.className = "custom-table draggable-el";

        // Создаём шапку таблицы
        const thead = document.createElement("thead");
        table.appendChild(thead);

        // Заполняем шапку
        const columns_names = Context.data.columns_names ? Context.data.columns_names.split(', ') : undefined
        const head_row = this.createRow("th", columns_names)
        thead.appendChild(head_row);

        // Создаём тело таблицы
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        // Добавляем строки в таблицу
        for (let i=0; i<Context.data.rows_cnt!; i++) {
            // Создаем строки и заполняем их
            const row =  this.createRow("td");
            
            tbody.appendChild(row);
        }

        if (Context.data.pagination) {
            // Создаем основной контейнер app-row-layout
            const rowLayout = document.createElement('app-row-layout');
            rowLayout.className = 'ng-star-inserted';
            rowLayout.setAttribute('data-elements-align', 'right');

            // Создаем первую кнопку (левая стрелка)
            const leftButtonTemplate = document.createElement('elma-button-template');
            leftButtonTemplate.className = 'ng-star-inserted';

            const leftButton = document.createElement('button');
            leftButton.setAttribute('type', 'button');
            leftButton.className = 'btn btn-default btn-style-icon elma-icons';
            leftButton.textContent = 'hand_point_left';

            leftButtonTemplate.appendChild(leftButton);
            rowLayout.appendChild(leftButtonTemplate);

            // Создаем элемент счетчика
            const counter = document.createElement('p');
            counter.className = 'counter';
            counter.textContent = '1 / 1';

            // Создаем стили для счетчика
            const style = document.createElement('style');
            style.textContent = `
                .counter {
                    display: table-cell;
                    vertical-align: middle;
                    transform: translate(0, 15%);
                }
            `;

            // Создаем скрытый div
            const templateRenderer = document.createElement('div');
            templateRenderer.className = 'template-renderer ng-star-inserted';
            templateRenderer.style.display = 'none';

            // Создаем вторую кнопку (правая стрелка)
            const rightButtonTemplate = document.createElement('elma-button-template');
            rightButtonTemplate.className = 'ng-star-inserted';

            const rightButton = document.createElement('button');
            rightButton.setAttribute('type', 'button');
            rightButton.className = 'btn btn-default btn-style-icon elma-icons';
            rightButton.textContent = 'hand_point_right';

            rightButtonTemplate.appendChild(rightButton);

            // Добавляем все элементы в основной контейнер
            rowLayout.appendChild(counter);
            rowLayout.appendChild(style);
            rowLayout.appendChild(templateRenderer);
            rowLayout.appendChild(rightButtonTemplate);

            tableContainer.appendChild(rowLayout);
        }

        // Добавляем элемент в DOM
        const block = document.querySelector(`#${Context.data.block_id}`);
        block.appendChild(tableContainer)

        // Добавляем кнопку удвления элемента
        this.addDelBtn(tableContainer, 'custom_component', block);
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
    }

    addProgressBar() {
        // Создаем основной компонент
        const customComponent = document.createElement('app-custom-component');

        customComponent.className = 'ng-star-inserted draggable-el';

        // Создаем контейнер для прогресс-бара
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-bar_probabilityOutflow';

        // Создаем сам прогресс-бар
        const progressBar = document.createElement('div');
        progressBar.className = 'progress_probabilityOutflow';
        progressBar.id = '_id';
        progressBar.style.width = '50%';
        progressBar.style.background = 'linear-gradient(90deg, rgb(165, 214, 167), rgb(255, 241, 118))';

        // Добавляем прогресс-бар в контейнер
        progressBarContainer.appendChild(progressBar);

        // Создаем элемент для отображения процентов
        const percentageElement = document.createElement('div');
        percentageElement.className = 'percentage_probabilityOutflow';
        percentageElement.id = '_percentage';

        const boldText = document.createElement('b');
        boldText.textContent = '50%';
        percentageElement.appendChild(boldText);

        // Добавляем элементы в основной компонент
        customComponent.appendChild(progressBarContainer);
        customComponent.appendChild(percentageElement);

        // Создаем и добавляем скрытый div
        const templateRenderer = document.createElement('div');
        templateRenderer.setAttribute('_ngcontent-ng-c2393608962', '');
        templateRenderer.className = 'template-renderer ng-star-inserted';
        templateRenderer.style.display = 'none';

        customComponent.appendChild(templateRenderer);

        // Добавляем элемент в DOM
        const block = document.querySelector(`#${Context.data.block_id}`);
        block.appendChild(customComponent); 

        // Добавляем кнопку удвления элемента
        this.addDelBtn(customComponent, 'custom_component', block);
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
    }

    addInfoBlock() {
        const infoBlock = document.createElement('div');

        infoBlock.className = "label draggable-el";
        infoBlock.textContent = Context.data.block_text;

        switch(Context.data.color!.code) {
            case 'blue':
                infoBlock.classList.add("label--blue");
                break;
            case 'green':
                infoBlock.classList.add("label--green");
                break;
            case 'yellow':
                infoBlock.classList.add("label--yellow");
                break;
            case 'red':
                infoBlock.classList.add("label--red");
                break;
            case 'grey':
                infoBlock.classList.add("label--light-grey");
                break;
            
        }

        // Добавляем элемент в DOM
        const block = document.querySelector(`#${Context.data.block_id}`);
        block.appendChild(infoBlock);

        // Добавляем кнопку удвления элемента
        this.addDelBtn(infoBlock, 'custom_component', block);
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
    }

    addTasks() {

        const tableContainer = document.createElement("div");
        // Создаём таблицу
        const table = document.createElement("table");
        tableContainer.appendChild(table);
        table.className = "custom-table draggable-el";

        // Создаём шапку таблицы
        const thead = document.createElement("thead");
        table.appendChild(thead);

        // Заполняем шапку
        const head_row = document.createElement("tr")
        thead.appendChild(head_row);        

        // Создаем ячейки и заполняем их
        for (let i of ['', 'Исполнители', "Задача", ""]) {
            const cell = document.createElement("th");
            cell.textContent = i;
            head_row.appendChild(cell)
        }        

        // Создаем строки
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        this.addRowToTable(tbody, false);
        this.addRowToTable(tbody, true);

        // Добавляем элемент в DOM
        const block = document.querySelector(`#${Context.data.block_id}`);
        block.appendChild(tableContainer)

        // Добавляем кнопку удвления элемента
        this.addDelBtn(tableContainer, 'custom_cimponent', block);
        
        // Инициализация перетаскивания
        block.classList.add('form-dnd')
        new FormFieldDnD(block);
    }

    private addRowToTable(tbody: any, done: boolean) {
    
        // Создаем новую строку
        const row = document.createElement("tr");
        row.className += ' table-row'

        const performersCell = document.createElement("td");
        performersCell.textContent = 'Фамилия Имя Отчество';

        const taskCell = document.createElement("td");
        const taskA = document.createElement("a");
        taskA.className += ' task-link'
        taskA.textContent = 'Название задачи';
        taskA.target = "_blank";taskA.style.textDecoration = done ? "line-through" : "none";
        taskA.style.color = done ?? "#d9d9d9 !important";

        taskCell.appendChild(taskA)

        const btnsCell = document.createElement("td");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "2rem");
        svg.setAttribute("height", "2rem");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        // Создаем путь в группе
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 22.5C11.78 22.5 11.57 22.46 11.37 22.39C11.17 22.33 10.98 22.23 10.8 22.1L4.8 17.6C4.55 17.41 4.35 17.18 4.21 16.89C4.07 16.61 4 16.31 4 16L4 4C4 3.44 4.19 2.97 4.58 2.58C4.97 2.19 5.44 2 6 2L18 2C18.54 2 19.02 2.19 19.41 2.58C19.8 2.97 20 3.44 20 4L20 16C20 16.31 19.92 16.61 19.78 16.89C19.64 17.18 19.45 17.41 19.2 17.6L13.2 22.1C13.01 22.23 12.82 22.33 12.62 22.39C12.42 22.46 12.21 22.5 12 22.5ZM12 20.5L18 16L18 4L6 4L6 16L12 20.5ZM10.95 12.14L9.55 10.75C9.34 10.55 9.11 10.45 8.84 10.46C8.58 10.47 8.34 10.56 8.15 10.75C7.94 10.95 7.84 11.18 7.83 11.46C7.82 11.73 7.92 11.97 8.12 12.17L10.25 14.3C10.45 14.5 10.68 14.6 10.95 14.6C11.21 14.6 11.45 14.5 11.65 14.3L15.9 10.05C16.1 9.85 16.19 9.61 16.18 9.35C16.17 9.08 16.08 8.85 15.9 8.64C15.7 8.44 15.46 8.34 15.18 8.33C14.91 8.32 14.67 8.42 14.47 8.62L10.95 12.14Z");
        path.setAttribute("fill-opacity", "1.000000");
        path.setAttribute("fill-rule", "nonzero");

        svg.appendChild(path);

        //data.done ? path.setAttribute("fill", "#11BA2F") : path.setAttribute("fill", "#d9d9d9");
        svg.style.fill = done ? "#11BA2F" : "#d9d9d9";

        btnsCell.appendChild(svg);

        const arrowCell = document.createElement("td");
        const arrowA = document.createElement("a");
        arrowA.className += ' arrow-link'
        arrowA.target = "_blank";
        const arrowDiv = document.createElement("div");
        arrowDiv.className += 'arrow-div';

        // Создаем основной элемент SVG
        const svgArrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgArrow.setAttribute("width", "2rem");
        svgArrow.setAttribute("height", "2rem");
        svgArrow.setAttribute("viewBox", "0 0 24 24");
        svgArrow.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        // Создаем путь стрелки
        const pathArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathArrow.setAttribute("id", "arrow_forward");
        pathArrow.setAttribute("d", "M11.3 19.29C11.11 19.11 11.02 18.88 11.01 18.59C11 18.31 11.09 18.08 11.27 17.89L16.17 13L5 13C4.71 13 4.47 12.9 4.28 12.71C4.09 12.52 4 12.28 4 12C4 11.71 4.09 11.47 4.28 11.28C4.47 11.09 4.71 11 5 11L16.17 11L11.27 6.09C11.09 5.91 11 5.68 11.01 5.39C11.02 5.11 11.11 4.88 11.3 4.69C11.48 4.51 11.71 4.42 12 4.42C12.28 4.42 12.51 4.51 12.7 4.69L19.29 11.29C19.4 11.38 19.47 11.48 19.51 11.61C19.55 11.73 19.57 11.86 19.57 12C19.57 12.13 19.55 12.25 19.51 12.37C19.47 12.49 19.4 12.59 19.29 12.69L12.7 19.29C12.51 19.48 12.28 19.57 12 19.57C11.71 19.57 11.48 19.48 11.3 19.29Z");
        pathArrow.setAttribute("fill-opacity", "1.000000");
        pathArrow.setAttribute("fill-rule", "nonzero");

        svgArrow.appendChild(pathArrow);
        arrowDiv.appendChild(svgArrow);
        arrowA.appendChild(arrowDiv); 
        arrowCell.appendChild(arrowA);
        
        // Добавляем ячейки в строку
        row.appendChild(btnsCell);
        row.appendChild(performersCell);
        row.appendChild(taskCell);
        row.appendChild(arrowCell);

        // Добавляем строку в таблицу
        tbody.appendChild(row);
    }

    private addDelBtn(elem: any, elemType: string, parent: any) {
        elem.style.position = "relative";
        
        // Добавляем кнопку удаления элемента
        const btnDel = document.createElement("button");
        elem.appendChild(btnDel);
        btnDel.className = "btn-del custom-btn delete-on-export";
        btnDel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>Удалить элемент</title>
                <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
            </svg>
        `

        btnDel.onclick = function() {
            elem.remove();
        }

        // Добавляем кнопку редактирования элемента
        const btnEdit = document.createElement("button");
        elem.appendChild(btnEdit);
        btnEdit.className = "btn-edit custom-btn delete-on-export";
        btnEdit.id = elemType;
        btnEdit.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>Отредактировать элемент</title>
                <path d="M19.71,8.04L17.37,10.37L13.62,6.62L15.96,4.29C16.35,3.9 17,3.9 17.37,4.29L19.71,6.63C20.1,7 20.1,7.65 19.71,8.04M3,17.25L13.06,7.18L16.81,10.93L6.75,21H3V17.25M16.62,5.04L15.08,6.58L17.42,8.92L18.96,7.38L16.62,5.04M15.36,11L13,8.64L4,17.66V20H6.34L15.36,11Z" />
            </svg>
        `

        btnEdit.onclick = function() {
            Context.data.block_id = parent ? parent.id : elem.parentElement.id;
            console.log(Context.data.block_id)
            Context.data.edit = true;
            Context.data.elem = elem;

            switch(elemType) {
                case 'btn':
                    Context.data.show_modal_btn = true;
                    break;
                case 'grid':
                    Context.data.show_main_area_settings_block = true;
                    break;
                case 'block':
                    Context.data.show_side_bar_options = true;
                    break;
                case 'field':
                    Context.data.show_modal = true;
                    break;
                case 'custom_component':
                    Context.data.show_modal_custom= true;
                    break;
                case 'tabs':
                    Context.data.show_tabs_modal= true;
                    break;
            }
        }
    }

    private createRow(typeCell: string, value?: string[] | undefined) {
        // Создаем новую строку
        const row = document.createElement("tr");

        // Создаем ячейки и заполняем их
        for (let i=0; i<Context.data.table_columns_cnt!; i++) {
            const cell = document.createElement(typeCell);
            cell.textContent = value && value.length > 0 ? value[i] : 'Значение ' + i;
            row.appendChild(cell)
        }

        if (Context.data.delete_btn || Context.data.edit_btn) { //Создаём кнопки редактирования и удаления

            if (typeCell == "td") {
                const btnsCell = document.createElement("td");

                if (Context.data.delete_btn) {
                    const btn = document.createElement("button");
                    btn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>Удалить</title>
                            <path d="M18,19C18,20.66 16.66,22 15,22H8C6.34,22 5,20.66 5,19V7H4V4H8.5L9.5,3H13.5L14.5,4H19V7H18V19M6,7V19C6,20.1 6.9,21 8,21H15C16.1,21 17,20.1 17,19V7H6M18,6V5H14L13,4H10L9,5H5V6H18M8,9H9V19H8V9M14,9H15V19H14V9Z" />
                        </svg>
                    ` 
                    btn.className += 'custom-btn ';

                    btn.onclick = function() {
                        row.remove();
                    }

                    btnsCell.appendChild(btn);
                }

                if (Context.data.edit_btn) {
                    const btn = document.createElement("button");
                    btn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>Редактировать</title>
                            <path d="M19.71,8.04L17.37,10.37L13.62,6.62L15.96,4.29C16.35,3.9 17,3.9 17.37,4.29L19.71,6.63C20.1,7 20.1,7.65 19.71,8.04M3,17.25L13.06,7.18L16.81,10.93L6.75,21H3V17.25M16.62,5.04L15.08,6.58L17.42,8.92L18.96,7.38L16.62,5.04M15.36,11L13,8.64L4,17.66V20H6.34L15.36,11Z" />
                        </svg>
                    `
                    btn.className += 'custom-btn ';

                    btnsCell.appendChild(btn);
                }

                row.appendChild(btnsCell)
            } else {
                const btnsCell = document.createElement("th");
                row.appendChild(btnsCell)
            }
            
        }

        return row;
    }

    private addBtns(block: any, random=0) {
        this.addBtn(block, random, 'Добавить поле', 'show_modal');
        this.addBtn(block, random, 'Добавить кнопку', 'show_modal_btn');
        this.addBtn(block, random, 'Добавить кастомный элемент', 'show_modal_custom');
    }

    private addBtn(block: any, random: number, name: string, modal: string) {
        const btn = document.createElement('button');
        btn.className = "btn btn-primary delete-on-export add-btn";
        btn.textContent = name;
        btn.setAttribute('id', random);
        btn.style.margin = "0.5rem";
        btn.setAttribute('modal', modal);

        btn.addEventListener('click', (e: any) => {
            switch (modal) {
                case 'show_modal':
                    Context.data.show_modal = true;
                    break;
                case 'show_modal_btn':
                    Context.data.show_modal_btn = true;
                    break;
                case 'show_modal_custom':
                    Context.data.show_modal_custom = true;
                    break;
                
            } 
            Context.data.block_id = `block_${e.target.id}`;
        })

        block.appendChild(btn);
    }

    private createTooltip(formRow: any, clue: string | undefined): any {
        const tooltipGrid = document.createElement('div');
        tooltipGrid.classList.add("tooltip-grid")

        // Создаем основной контейнер tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip4';

        // Создаем SVG элемент
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 2rem 2rem');
        svg.setAttribute('width', '2.2rem');
        svg.setAttribute('height', '2.2rem');

        // Создаем path для SVG
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M11.5,4C6.81,4 3,7.81 3,12.5C3,17.19 6.81,21 11.5,21C16.19,21 20,17.19 20,12.5C20,7.81 16.19,4 11.5,4M11.5,3C16.75,3 21,7.25 21,12.5C21,17.75 16.75,22 11.5,22C6.25,22 2,17.75 2,12.5C2,7.25 6.25,3 11.5,3M11,17H12V19H11V17M11.5,6C13.43,6 15,7.57 15,9.5C15,10.4 14.3,11 13.56,11.68L12.63,12.58C12.04,13.25 11.97,14.53 12,14.97V15H11C11,14.95 10.9,13.04 11.87,11.92L12.9,10.93C13.5,10.4 14,9.95 14,9.5C14,8.12 12.88,7 11.5,7C10.12,7 9,8.12 9,9.5H8C8,7.57 9.57,6 11.5,6Z');

        // Добавляем path в SVG
        svg.appendChild(path);

        // Создаем контейнер для текста подсказки
        const tooltipText = document.createElement('div');
        tooltipText.className = 'tooltiptext4';

        // Создаем параграфы с текстом
        const p = document.createElement('p');
        p.textContent = clue;

        // Добавляем параграфы в контейнер текста
        tooltipText.appendChild(p);
        // Добавляем SVG и текст в основной контейнер
        tooltip.appendChild(svg);
        tooltip.appendChild(tooltipText);

        formRow.style.marginBottom = 0;

        tooltipGrid.appendChild(formRow);
        tooltipGrid.appendChild(tooltip);

        return tooltipGrid
    }

}

async function setSideBarValue(): Promise<void> {

    try {
        if (!Context.data.side_bar) return;

        const form = new Form(); 

        form.setSideBarValue(Context.data.side_bar.code);
        
    } catch(error) {
                    
        console.log(error.message); 
    }
}

async function addGrid(): Promise<void> {
    
    try {
        if (Context.data.edit) {
            Context.data.elem.remove();
            Context.data.edit = false;
        }

        const form = new Form(); 

        form.addGrid()
        
    } catch(error) {
                    
        console.log(error.message); 
    }
}

async function addBlock(): Promise<void> {
    
    try {
        if (Context.data.edit) {
            Context.data.elem.remove();
            Context.data.edit = false;
        }
        const form = new Form(); 

        form.addBlock();
        
    } catch(error) {
                    
        console.log(error.message); 
    }
}

async function addField(): Promise<void> {

    try {
        if (Context.data.edit) {
            Context.data.elem.remove();
            Context.data.edit = false;
        }
        Context.data.show_modal = false;
        const form = new Form(); 

        if (!Context.data.field_type) return;

        switch (Context.data.field_type.code) {
            case 'basic':
                form.createField('basic', Context.data.field_name ? Context.data.field_name : 'Название поля', Context.data.clue);
                break;
            case 'string':
                form.createField('string', Context.data.field_name ? Context.data.field_name : 'Название поля', Context.data.clue);
                break;
            case 'text':
                form.createField('text', Context.data.field_name ? Context.data.field_name : 'Название поля', Context.data.clue);
                break;
            case 'category':
                form.createField('category', Context.data.field_name ? Context.data.field_name : 'Название поля', Context.data.clue);
                break;
            case 'date':
                form.createField('date', Context.data.field_name ? Context.data.field_name : 'Название поля', Context.data.clue);
                break;
            case 'bool':
                form.createBool(Context.data.field_name ? Context.data.field_name : 'Название поля', Context.data.clue, Context.data.yes, Context.data.no);
                break;
            case 'flag':
                form.createFlag(Context.data.field_name ? Context.data.field_name : 'Название поля', Context.data.clue);
                break;
            case 'user':
                form.createUserField();
                break;
            case 'file':
                form.createField('file', Context.data.field_name ? Context.data.field_name : 'Название поля', Context.data.clue);
                break;
        }
    } catch(e) {
        console.log(e.message)
    }
}

async function addBtn(): Promise<void> {

    try {
        if (Context.data.edit) {
            Context.data.elem.remove();
            Context.data.edit = false;
        }
        Context.data.show_modal_btn = false;
        const form = new Form(); 

        if (!Context.data.btn_type) return;

        switch (Context.data.btn_type.code) {
            case 'defolt':
                form.createBtn('default', Context.data.btn_text ? Context.data.btn_text : 'Название кнопки');
                break;
            case 'primary':
                form.createBtn('primary', Context.data.btn_text ? Context.data.btn_text : 'Название кнопки');
                break;
            case 'danger':
                form.createBtn('danger', Context.data.btn_text ? Context.data.btn_text : 'Название кнопки');
                break;
        }
    } catch(e) {
        console.log(e.message)
    }
}

async function addCustomElem(): Promise<void> {
    try {
        if (Context.data.edit) {
            Context.data.elem.remove();
            Context.data.edit = false;
        }
        Context.data.show_modal_custom = false;
        const form = new Form(); 

        if (!Context.data.elem_type) return;

        switch (Context.data.elem_type.code) {
            case 'table':
                form.addTable();
                break;
            case 'progress_bar':
                form.addProgressBar();
                break;
            case 'info_block':
                form.addInfoBlock();
                break;
            case 'tasks':
                form.addTasks();
                break;
        }
    } catch(e) {
        console.log(e.message)
    }
}

async function saveInElma() {
    Context.data.show_modal_form_save = true;
}

async function saveForm(): Promise<void> {
    Context.data.show_modal_form_save = false;

    const html_draft = document.getElementById("form").innerHTML;

    const btns = document.querySelectorAll(".delete-on-export");

    for (const btn of btns) {
        btn.style.display = "none";
    }

    const html = document.getElementById("element-to-save").innerHTML;

    if (!Context.data.form) {
        await Namespace.app.forms.processes.form_create.run({
            form_name: Context.data.form_name ? Context.data.form_name : `Форма ${(new TDate()).format()}`,
            form_code: `form_${(new Datetime()).format()}`,
            html: html,
            html_draft: html_draft,
            side_bar: Context.data.side_bar ? Context.data.side_bar.code : 'no'
        })

        Context.data.form = await Namespace.app.forms.search().where((f, g) => g.and(
            f.code.eq(Context.data.form_code!),
            f.__deletedAt.eq(null)
        )).first()

    } else {
        const form = await Context.data.form!.fetch();

        form.data.html = html;
        form.data.html_draft = html_draft;
        form.data.side_bar = Context.data.side_bar ? Context.data.side_bar.code : 'no'

        await form.save();
    }

    window.setTimeout(() => {
        for (const btn of btns) {
            btn.style.display = "inline-block";
        }
    }, 300);
}

async function addTabs(): Promise<void> {
    try {
        if (Context.data.edit) {
            Context.data.elem.remove();
            Context.data.edit = false;
        }
        Context.data.show_tabs_modal = false;
        const form = new Form(); 

        form.addTabs();

    } catch(e) {
        console.log(e.message)
    }
}

async function onLoad(): Promise<void> {
    try {

        Context.data.counter = Context.data.all_fields && Context.data.all_fields.length > 0 ? Context.data.all_fields.length-1 : 0;
        Context.data.all_fields = Context.data.all_fields ?? [];

        if (!Context.data.form) return;

        const form = await Context.data.form.fetch();

        const formEl = document.getElementById("form")
        formEl.innerHTML = form.data.html_draft;
        formEl.style.visibility = "visible";

        const btn_basic = document.querySelectorAll(".btn-basic");

        if (btn_basic)
            for (const btn of btn_basic) {
                btn.addEventListener('click', () => {
                    Context.data.show_main_area_settings_block = true;
                    Context.data.block_id = `basic-div`;
                })
            }

        const btn_tabs = document.querySelectorAll(".btn-tabs");

        if (btn_tabs)
            for (const btn of btn_tabs) {
                btn.addEventListener('click', () => {
                    Context.data.show_tabs_modal = true;
                })
            }

        const add_block = document.querySelectorAll(".add-block");

        if (add_block)
            for (const btn of add_block) {
                btn.addEventListener('click', () => {
                    Context.data.show_side_bar_options = true;
                })
            }

        const tabLinks = document.querySelectorAll(".nav-link");

        if (tabLinks)
            for (const tabLink of tabLinks) {
                tabLink.addEventListener('click', () => {
                    document.querySelectorAll(".nav-link").forEach((tab: any) => {
                        tab.className = 'nav-link ng-star-inserted';
                    });

                    tabLink.className = 'nav-link ng-star-inserted active';

                    document.querySelectorAll(".tab-panel").forEach((tab: any) => {
                        tab.classList.remove('active');
                    });

                    document.getElementById(`${tabLink.id}-panel`).classList.add('active');
                })
            }

        const btn_basics_grid = document.querySelectorAll(".btn-basic-grid");

        if (btn_basics_grid)
            for (const btn_basic of btn_basics_grid) {
                btn_basic.addEventListener('click', () => {
                    Context.data.show_main_area_settings_block = true;
                    Context.data.block_id = btn_basic.parent.id;
                })
            }

        const add_btns = document.querySelectorAll(".add-btn");

        if (add_btns)
            for (const btn of add_btns) {
                    btn.addEventListener('click', (e: any) => {
                        switch (btn.textContent) {
                            case 'Добавить поле':
                                Context.data.show_modal = true;
                                break;
                            case 'Добавить кнопку':
                                Context.data.show_modal_btn = true;
                                break;
                            case 'Добавить кастомный элемент':
                                Context.data.show_modal_custom = true;
                                break;
                            
                        } 
                        Context.data.block_id = `block_${btn.id}`;
                    })
            }

        const del_btns = document.querySelectorAll(".btn-del");

        if (del_btns)
            for (const btn of del_btns) {
                    btn.addEventListener('click', (e: any) => {
                        if (e.target.tagName === 'path') e.target.parentElement.parentElement.parentElement.remove();
                        if (e.target.tagName === 'svg') e.target.parentElement.parentElement.remove()
                    })
            }

        const edit_btns = document.querySelectorAll(".btn-edit");

        if (edit_btns)
            for (const btn of edit_btns) {
                btn.addEventListener('click', (e: any) => {
                    console.log(e.target.tagName)
                    Context.data.edit = true;
                    let id = '';

                    if (e.target.tagName === 'path') {
                        Context.data.elem = e.target.parentElement.parentElement.parentElement;
                        Context.data.block_id = e.target.parentElement.parentElement.parentElement.id;
                        id = e.target.parentElement.parentElement.id
                    }

                    if (e.target.tagName === 'svg') {
                        Context.data.elem = e.target.parentElement.parentElement;
                        Context.data.block_id = e.target.parentElement.parentElement.id;
                        id = e.target.parentElement.id
                    }

                    switch(id) {
                        case 'btn':
                            Context.data.show_modal_btn = true;
                            break;
                        case 'grid':
                            Context.data.show_main_area_settings_block = true;
                            break;
                        case 'block':
                            Context.data.show_side_bar_options = true;
                            break;
                        case 'field':
                            Context.data.show_modal = true;
                            break;
                        case 'custom_component':
                            Context.data.show_modal_custom= true;
                            break;
                        case 'tabs':
                            Context.data.show_tabs_modal= true;
                            break;
                    }
                })
        }

        // Ищем вкладки
        const tabs = document.querySelectorAll(".nav-link")
        for (let tabLink of tabs) {
            tabLink.addEventListener('click', () => {
                document.querySelectorAll(".nav-link").forEach((tab: any) => {
                    tab.className = 'nav-link ng-star-inserted';
                });

                tabLink.className = 'nav-link ng-star-inserted active';

                document.querySelectorAll(".tab-panel").forEach((tab: any) => {
                    tab.classList.remove('active');
                });

                document.getElementById(`${tabLink.id}-panel`).classList.add('active');
            })
        }

        //Инициализация перетаскивания
        const formDnD = document.querySelectorAll('.form-dnd');
        for (const form of formDnD) {
            new FormFieldDnD(form);
        }
        
    } catch(error) {
                    
        console.log(error.message); 
    }
}

// Реализуем DnD
class FormFieldDnD {
  fieldsContainer: any; //Разметка, блок, внутри которого будем таскать элементы
  private draggedItem: any | null = null; //Элемент, который таскаем
  private dragCounter = 0;

  constructor(fieldsContainer: any) {
    this.fieldsContainer = fieldsContainer;
    this.init();
  }

  private init(): void {
    this.makeFieldsDraggable();
    this.setupDropZones();
  }

  private makeFieldsDraggable(): void {
    const fields = this.fieldsContainer.querySelectorAll('.draggable-el'); //Пометим элементы для перетаскивания классом
    
    fields.forEach((field: any) => {
      field.draggable = true;
      
      field.addEventListener('dragstart', (e: any) => {
        this.draggedItem = field;
        e.dataTransfer!.setData('text/plain', field.id);
        field.classList.add('dragging');
        window.setTimeout(() => field.classList.add('invisible'), 0);
      });

      field.addEventListener('dragend', () => {
        field.classList.remove('dragging', 'invisible');
        this.draggedItem = null;
      });
    });
  }

  private setupDropZones(): void {
    const fields = this.fieldsContainer.querySelectorAll('.draggable-el'); //Пометим элементы для перетаскивания классом
    
    fields.forEach((field: any) => {
      field.addEventListener('dragenter', (e: any) => {
        e.preventDefault();
        this.dragCounter++;
        field.classList.add('drag-over');
      });

      field.addEventListener('dragover', (e: any) => {
        e.preventDefault();
        if (!this.draggedItem) return;
        
        const afterElement = this.getDragAfterElement(field, e.clientY);
        if (afterElement) {
          afterElement.insertAdjacentElement('beforebegin', this.draggedItem);
        } else {
          field.parentNode!.appendChild(this.draggedItem);
        }
      });

      field.addEventListener('dragleave', (e: any) => {
        e.preventDefault();
        this.dragCounter--;
        if (this.dragCounter === 0) {
          field.classList.remove('drag-over');
        }
      });

      field.addEventListener('drop', (e: any) => {
        e.preventDefault();
        this.dragCounter = 0;
        field.classList.remove('drag-over');
        this.saveFieldOrder();
      });
    });
  }

  private getDragAfterElement(container: any, y: number): any | null {
    const draggableElements = [...container.parentNode!.querySelectorAll('.draggable-el:not(.dragging)')];

    return draggableElements.reduce<{ offset: number, element: any | null }>(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
  }

  private saveFieldOrder(): void {
    const fieldIds = Array.from(this.fieldsContainer.querySelectorAll('.draggable-el')).map((f: any) => f.id);
    console.log('Новый порядок полей:', fieldIds);
  }
}
