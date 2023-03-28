(()=> {
    let showpwdBtnEnvato = document.getElementById('showpwdEnvato');
    let showpwdBtnDeepl = document.getElementById('showpwddeepl');

    showpwdBtnEnvato.addEventListener('click', ()=> {
        showpwd("envatoAPI");
    })
    showpwdBtnDeepl.addEventListener('click', ()=> {
        showpwd("deeplAPI");
    })




    function showpwd(tagId) {
        var x = document.getElementById(tagId);
        if (x.type === "password") {
          x.type = "text";
        } else {
          x.type = "password";
        }
      }
})()