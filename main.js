window.addEventListener("load",function(){
    if(localStorage.getItem("user_name")){
        const user_name_display = document.getElementById("form_start");
        user_name_display.id = "user_name";
        window.user_name = localStorage.getItem("user_name");
        user_name_display.innerText = user_name;
        const form = document.getElementById("init_form");
        form.remove();
    }
    if(localStorage.getItem("user_level")){
        const level_display = document.getElementById("init_start");
        level_display.id = "user_level";
        window.user_level = localStorage.getItem("user_level");
        level_display.innerText = "修为: "+user_level;
    }
}) 
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
            const letin = document.createElement("input");
            letin.type = "button";
            letin.value = "Confirm";
            newform.appendChild(letin);
            init_form.appendChild(newform);
            letin.addEventListener("click",function(){
                localStorage.setItem("user_name",nameinput.value);
                init_form.remove();
            })
    }
}
function start(){
    const init_start = document.getElementById("init_start");
    init_start.id = "user_level";
    if(!localStorage.getItem("user_level")){
        localStorage.setItem("user_level","一转");
    }
    window.user_level = "一转";
    init_start.innerText = "修为: "+window.user_level;
}