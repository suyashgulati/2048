var a = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]];

var prevStateStack = [];

var nowMerged = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

$(function() {
  startup();
  
  var lower = document.getElementsByClassName("lower")[0];
  lower.addEventListener('swl', e=>{
    checkAndGo(37);
  },false);
  lower.addEventListener('swu', e=>{
    checkAndGo(38);
  },false);
  lower.addEventListener('swr', e=>{
    checkAndGo(39);
  },false);
  lower.addEventListener('swd', e=>{
    checkAndGo(40);
  },false);
  
  $(document).keydown(e => {
    var code = e.keyCode || e.which;
    checkAndGo(code);
  });

  $("button#undo").on("click", e => {
    // console.log(prevStateStack);
    if (prevStateStack.length != 0) {
      a = prevStateStack.pop();
      DOMUpdate();
    } else {
      console.log("Cannot Undo more");
    }
  });
});

var checkAndGo = function(code){
  $("div.inner").removeClass('newTile');
  nowMerged = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  prevStateStack.push($.extend(true, [], a));
    switch (code) {
      case 37:
        left();
        break;
      case 38:
        up();
        break;
      case 39:
        right();
        break;
      case 40:
        down();
        break;
    }
    var prev = prevStateStack[prevStateStack.length - 1];
    if (!prev.equals(a)) {
      getNewTiles().then(DOMUpdate);
    } else {
      prevStateStack.pop();
    }
}

var startup = () => {
  $(".outer").height($(".outer").width());
  $(window).resize(function() {
    $(".outer").height($(".outer").width());
  });
  // DOMUpdate();
  getNewTiles().then(DOMUpdate);
  getNewTiles().then(DOMUpdate);
};

var DOMUpdate = (data = {x: -1, y:-1, val:-1}) => {
  $(".inner").each((i, val) => {
    $(val).html(a[Math.floor(i / 4)][i % 4]);
    $(val).attr("data-value", ""+ a[Math.floor(i / 4)][i % 4]);
    // $(val).css("top", ""+ Math.floor(i / 4)*25 +"%");   
    // $(val).css("left", ""+ (i % 4)*25 +"%");

  });
  // $(".score").html(a.sumAll());
  $("div.inner:nth-child("+(data.x*4 + data.y + 1)+")").addClass('newTile');
  return new Promise((resolve, reject) => {
    resolve("DOMUpdate Done");
  });
};

var getNewTiles = function(data = {}) {
  var x = 0;
  var y = 0;
  var val = -1;
  while (val != 0) {
    x = random();
    y = random();
    val = a[x][y];
  }
  a[x][y] = 2 * random(1, 2);
  
  // console.log(data);
  return new Promise((resolve, reject) => {
    resolve({ x: x, y: y, val: a[x][y] });
  });
};

var random = function(min = 0, max = 3) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var left = () => {
  // console.log('left');
  for (var j = 1; j < 4; j++) {
    //column loop
    // var j=1;
    for (var i = 0; i < 4; i++) {
      //row loop
      // console.log('i, j', i, j, 'a[i][j]', a[i][j]);
      var val = a[i][j];

      if (val != 0) {
        var k = j - 1;
        for (; k >= 0 && a[i][k] == 0; k--) {}

        a[i][j] = 0;

        if (k == -1) {
          a[i][0] = val;
          // console.log('if1');
          // nowMerged[i][0] = 1;
        } else if (a[i][k] == val && nowMerged[i][k]!=1) {
          a[i][k] *= 2;
          nowMerged[i][k] = 1;
          // console.log('if2');
        } else {
          a[i][k + 1] = val;
          // nowMerged[i][k + 1] = 1;
          // console.log('if3');
        }
      } else {
      }
    }
  }
};

var up = () => {
  // console.log('up');
  for (var i = 1; i < 4; i++) {
    //row loop
    for (var j = 0; j < 4; j++) {
      //column loop

      var k = i - 1;
      for (; k >= 0 && a[k][j] == 0; k--) {}
      var val = a[i][j];
      a[i][j] = 0;

      // console.log('i,j',i,j);
      // console.log('k',k);

      if (k == -1) {
        a[0][j] = val;
        // console.log('if1');
      } else if (a[k][j] == val  && nowMerged[k][j]!=1) {
        a[k][j] *= 2;
        nowMerged[k][j]=1;
        // console.log('if2');
      } else {
        a[k + 1][j] = val;
        // console.log('if3');
      }
    }
  }
};

var right = () => {
  // console.log('right');
  for (var j = 2; j >= 0; j--) {
    //column loop
    // var j=1;
    for (var i = 0; i < 4; i++) {
      //row loop
      // console.log('i, j', i, j, 'a[i][j]', a[i][j]);
      var k = j + 1;
      for (; k < 4 && a[i][k] == 0; k++) {}

      var val = a[i][j];
      a[i][j] = 0;

      if (k == 4) {
        a[i][3] = val;
        // console.log('if1');
      } else if (a[i][k] == val && nowMerged[i][k]!=1) {
        a[i][k] *= 2;
        nowMerged[i][k]=1;
        // console.log('if2');
      } else {
        a[i][k - 1] = val;
        // console.log('if3');
      }
    }
  }
};

var down = () => {
  // console.log('down');
  for (var i = 2; i >= 0; i--) {
    //row loop
    for (var j = 0; j < 4; j++) {
      //column loop

      var k = i + 1;
      for (; k < 4 && a[k][j] == 0; k++) {}
      var val = a[i][j];
      a[i][j] = 0;

      // console.log('i,j',i,j);
      // console.log('k',k);

      if (k == 4) {
        a[3][j] = val;
        // console.log('if1');
      } else if (a[k][j] == val && nowMerged[k][j]!=1) {
        a[k][j] *= 2;
        nowMerged[k][j]=1;
        // console.log('if2');
      } else {
        a[k - 1][j] = val;
        // console.log('if3');
      }
    }
  }
};

Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

Array.prototype.sumAll = function() {
  var sum = 0;
  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array) {
      // recurse into the nested arrays
      sum += this[i].sumAll();
    } else {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      sum+=this[i];
    }
  }
  return sum;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "sumAll", { enumerable: false });

(function(D){
 var M=Math,abs=M.abs,max=M.max,
 ce,m,th=20,t,sx,sy,ex,ey,l,
 f={
  touchstart:function(e){
   t=e.touches[0];
   sx=t.pageX;
   sy=t.pageY
  },
  touchmove:function(e){
   m=1;
   t=e.touches[0];
   ex=t.pageX;
   ey=t.pageY
  },
  touchend:function(e){
   ce=D.createEvent("CustomEvent");
   ce.initCustomEvent(m?(
    max(sx=abs(ex-=sx),sy=abs(ey-=sy))>th?
    sx>sy?ex<0?'swl':'swr':ey<0?'swu':'swd':'fc'
   ):'fc',true,true,e.target);
   e.target.dispatchEvent(ce);
   m=0
  },
  touchcancel:function(e){
   m=0
  }
 }
 for(l in f)D.addEventListener(l,f[l],false)
})(document);