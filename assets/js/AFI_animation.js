(()=> {
    let showpwdPixabay = document.getElementById('showpwdPixabay');
    let showpwdBtnDeepl = document.getElementById('showpwddeepl');

    showpwdPixabay.addEventListener('click', ()=> {
        showpwd("pixabayAPI");
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