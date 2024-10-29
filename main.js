    window.init_form_counter = 0;
    function enter_information(){
        window.init_form_counter+=1;
        if(window.init_form_counter==1){
                const init_form = document.getElementById("init_form")
                window.start_enter = true;
                const newform = document.createElement("form");
                newform.id = "init_information";
                const namelabel = document.createElement('label');
                namelabel.for = 'textInput';
                namelabel.textContent = '道号：';
                const nameinput = document.createElement('input');
                nameinput.type = 'text';
                nameinput.id = 'textInput';
                nameinput.name = 'textInput';
                namelabel.appendChild(nameinput);
                newform.appendChild(namelabel);
                init_form.appendChild(newform);
        }
    }
    function start(){
        if(start_enter){
        const form_start = document.getElementById("form_start");
        const init_start = document.getElementById("init_start");
        setTimeout(() => {form_start.remove();init_start.remove();},1000);
        }
    }