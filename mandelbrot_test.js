let x_range = 2;
let y_range = 2;

function complex_abs(a,b){
    return (a**2+b**2)**0.5;
}

function x_iter_func(a,b,c_x) {
    return a**2-b**2+c_x;
}

function y_iter_func(a,b,c_y) {
    return 2*a*b+c_y
}


/*let z_n_a = a;
let z_n_b = b;
for(let i = 0; i < 10; ++i) {
    let temp_x = x_iter_func(z_n_a,z_n_b,a);
    let temp_y = y_iter_func(z_n_a,z_n_b,b);
    z_n_a = temp_x;
    z_n_b = temp_y;
    console.log(i);
    console.log("a: "+z_n_a+" ,b: "+z_n_b);
    console.log("complex_abs: "+complex_abs(z_n_a,z_n_b)+"\n\n");
}*/


//fillCanvas(renderer, "black");
for(let i = 125; i<127; ++i) {
    for(let j = 250; j <500; ++j) {
        let bounded = true;
        let x_val = x_range/500*i-x_range/2;
        let y_val = y_range/500*j-y_range/2;
        let x_iter = x_val;
        let y_iter = y_val;
        for(let k = 0; k<40 && bounded; ++k) {
            let x_iter_temp = x_iter_func(x_iter,y_iter,x_val);
            let y_iter_temp = y_iter_func(x_iter,y_iter,y_val);
            x_iter = x_iter_temp;
            y_iter = y_iter_temp;
            if(complex_abs(x_iter,y_iter)>2){
                bounded = false;
            }
        }
        if(bounded) {
           console.log("x: "+x_val+" , y:"+y_val+"is in the mandelbrot set!")
        } else {
            console.log("x: "+x_val+" , y:"+y_val+"is not in the mandelbrot set!")
        }
    }
  }
