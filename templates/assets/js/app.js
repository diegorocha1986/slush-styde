export default function(){
  var APP = {
    init : () => {
      APP.bind.init.call();
    },
    vars : {
    },
    cache : {
    },
    plugins : {
    },
    bind : {
      init: () => {
        console.log("APP Initiated!");
      }
    },
    functions : {
    }
  }

  APP.init.call();
}