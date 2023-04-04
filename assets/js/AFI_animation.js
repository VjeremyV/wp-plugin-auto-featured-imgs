(()=> {
    let showpwdPixabay = document.getElementById('showpwdPixabay');

    showpwdPixabay.addEventListener('click', ()=> {
        showpwd("pixabayAPI");
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