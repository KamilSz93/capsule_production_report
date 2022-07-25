window.onload = function () {
    console.log("START APP");
    count.init();
};

class Count {

  flag = [];
  
  requiredGross;

  requiredNet;

  endNet;

  averageEmpty = 0;

  averageGross = 0;

  sumBruttoCapsule = [];

  noMeasurement = 0;

  init() {

    document.querySelector("#inputDate").valueAsDate = new Date();

    document.querySelector("#measurementDate").valueAsDate = new Date();

    document.querySelector("#nextMeasurement").
      addEventListener("click", () => this.createNewMeasurement());
    
    document.querySelectorAll("input, select").forEach(
      el => el.addEventListener("input", () => this.checkInfo()));
  };

  checkInfo() {

    this.flag[0] = document.querySelectorAll(".form-check-input[type='checkbox']:checked").length
      ? true : false;

    //ALTERNATIVE SOLUTION
    //let checkBox = document.querySelectorAll(".form-check-input");
    //  for (let i = 0; i < checkBox.length; i++) {
    //    if (checkBox[i].checked == true) {
    //      this.flag[0] = true;
    //     break;
    //  } else this.flag[0] = false;
    //     };

    this.flag[1] = (document.querySelector("#productName").value.length > 0)
        ? true : false;

    let size = document.querySelector("#size");

    this.flag[2] = (document.querySelector("#size").selectedIndex > 0)
        ? true : false;

    this.flag[3] = (document.querySelector("#type").selectedIndex > 0)
        ? true : false;

    this.flag[4] = ( document.querySelector("#color").selectedIndex > 0)
        ? true : false;

    let inputNet = document.querySelector("#inputNet");

    if (isNaN(inputNet.value)) {
      alert("Padaj Liczbę!");
      inputNet.value = "";
    }
    this.flag[5] = (inputNet.value.length > 0)
        ? true : false;

    let inputAmountBatch = document.querySelector("#inputAmountBatch");

    if (isNaN(inputAmountBatch.value)) {
      alert("Podaj liczbę!");
      inputAmountBatch.value = "";
    }
    this.flag[6] =  (inputAmountBatch.value.length > 0)
       ? true : false;

    // Loop forEach hasn't break
    for (let i = 0; i < this.flag.length; i++) {
      if (this.flag[i] !== true) {
        break;
      } else if (i == this.flag.length - 1) {
        this.unlockCalculation();
      }
    }
  };

  unlockCalculation() {
    let inputEmpty = document.querySelectorAll("#inputEmpty, input[data-noMeasurement], #signature, #nextMeasurement");
   
    inputEmpty.forEach((el) => {
      el.setAttribute("placeholder", "");
      el.removeAttribute("disabled");
    });
    this.changeInputs();
  };

  changeInputs() {
    document.querySelector("#inputEmpty").
      addEventListener("input", (e) => this.emptyCalculation(e));
      
    document.querySelector("#inputNet").
      addEventListener("input", () => this.requiredNetCalculation());
  
    document.querySelectorAll("input[data-noMeasurement]").        
        forEach(el => {
          el.addEventListener("input", (e) => {
            this.bruttoCalculation(e)
         }); // forEach require as argument some function
        });
  };

  requiredNetCalculation() {  
    this.requiredNet = document.querySelector("#inputNet").value;
   
    if (isNaN(this.requiredNet)) {
        alert("podaj liczbe");
        this.requiredNet = "";
    };
      this.requiredNet = parseFloat(this.requiredNet);
      
    if (this.requiredNet) {

      this.requiredGross = this.requiredNet + this.averageEmpty;

      document.querySelector("#inputGross").value = this.requiredGross;
    };
  };

  emptyCalculation(e) {
    if (isNaN(e.target.value)) {
      alert("podaj liczne");
      e.target.value = "";
    };

    this.averageEmpty = (e.target.value / 20).toFixed(3);
    this.averageEmpty = parseFloat(this.averageEmpty);

    document.querySelector("#inputEmptyAverage").value = this.averageEmpty;

    this.requiredNetCalculation();

    if(this.sumBruttoCapsule[0]) this.endCalculation();
  };

  bruttoCalculation(e) {
      
    if (isNaN(e.target.value)) {
      alert("podaj liczne");
      e.target.value = "";
    };

    this.noMeasurement = e.target.getAttribute("data-noMeasurement");

    this.averageGross = (e.target.value / 20).toFixed(3);
    this.averageGross = parseFloat(this.averageGross);

    this.sumBruttoCapsule[this.noMeasurement] = this.averageGross;
    
    document.querySelector(`input[data-average-noMeasurement="${this.noMeasurement}"]`).value = this.averageGross;

    this.endCalculation();
  };

  endCalculation() {
     
    var total = 0;
    
    var endGross = 0;
  
    this.sumBruttoCapsule.forEach(value => { total += value; });

    endGross = (total / this.sumBruttoCapsule.length).toFixed(3);
    endGross = parseFloat(endGross);

    this.endNet = (endGross - this.averageEmpty).toFixed(3);
    this.endNet = parseFloat(this.endNet);
    
    document.querySelector("#endNet").value = this.endNet;  
     
    document.querySelector("#endGross").value = endGross; 
    
    this.visibilityInfoAlerts();
  };

  createNewMeasurement() {

    this.noMeasurement++;
      
    const newMeasurement = document.createElement("div");
    newMeasurement.classList.add("row");
    newMeasurement.classList.add("mt-1");
    newMeasurement.innerHTML = `
                <label class="col-6 col-md-3 col-form-label-sm mt-2">${this.noMeasurement+1}. Masa 20 szt. pełnych kapsułek: </label>
                <div class="col-6 col-md-3 mt-2">
                    <input type="text" class="form-control form-control-sm" data-noMeasurement="${this.noMeasurement}" placeholder="">
                </div>
                <label class="col-6 col-md-3 col-form-label-sm mt-2">Średnia masa pełnej kapsułki: </label>
                <div class="col-6 col-md-3 mt-2">
                    <input type="text" class="form-control form-control-sm" data-average-noMeasurement="${this.noMeasurement}" disabled readonly>
                </div>`;

    const good = document.getElementById("goodAlert");

    good.before(newMeasurement)
    
    this.changeInputs();
  };

  visibilityInfoAlerts() {

    const goodAlert = document.getElementById("goodAlert");

    const badAlert = document.getElementById("badAlert");

    let scopePlus = (this.requiredNet * 0.05) + this.requiredNet;
    let scopeMinus = this.requiredNet - (this.requiredNet * 0.05);

    if (this.endNet > scopePlus || this.endNet < scopeMinus) { 
      
      goodAlert.classList.remove("d-block");
      goodAlert.classList.add("d-none");

      badAlert.classList.remove("d-none");
      badAlert.classList.add("d-block");
    } else {
      badAlert.classList.remove("d-block");
      badAlert.classList.add("d-none");

      goodAlert.classList.remove("d-none");
      goodAlert.classList.add("d-block");
    };
  };
};
 
const count = new Count();