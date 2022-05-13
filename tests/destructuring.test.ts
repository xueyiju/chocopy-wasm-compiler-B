// PARSE ERROR :

// a, *b,c,*d = 3,4,5,6

// a, b,c,*d = 3,4,5,6



// TYPE ERRORS :
//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y = 1,2,3`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,z = 1,2`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y = 1+2`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,z = 1,2+3`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,_ = 1,2`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,_ = 1,2,3,4`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,_ = 1,2+3`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,_ = 1,2,3+4,5`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,_,*c = 2,3`);

// Check this testcase .. error msg might be different
//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,*c = 2`);

//   assertTCFail("length mismatch left and right hand side of assignment expression", `
//   x : bool = True
//   y : int = 12
//   x,y,_,*c = 5+6`);


// COMPILE ERROR :
