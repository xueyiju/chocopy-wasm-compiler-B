import { RunTimeError } from './error_reporting';

export function factorial(x:number){
  var r = 1;
  while(x>0)
    r = r * x--;
  return r;
}
export function randint(x:number, y:number){
  if(y<x) 
    throw new RunTimeError("randint range error, upperBound less than lowerBound");
  return Math.floor(Math.random()*(y-x+1) + x);
}
export function gcd(a:number,b:number):number{
  if (a<0 || b<0 || a==0 && b==0)
    throw new RunTimeError("gcd param error, eq or less than 0");
  return b==0 ? a : gcd(b,a % b);
}
export function lcm(x:number, y:number):number{
	if (x<=0 || y<=0 || x==0 && y==0)
		throw new RunTimeError("lcm param negative error, eq or less than 0");
	return Math.floor(x*y/gcd(x,y))
}

export function comb(x:number, y:number):number{
  if (x<y)
    throw new RunTimeError("comb param error");
	throw new RunTimeError("not implemented yet");
}
export function perm(x:number, y:number):number{
  if (x<y)
    throw new RunTimeError("perm param error");
	throw new RunTimeError("not implemented yet");
}
export function randrange(x:number, y:number, step:number){
  if(y<x) 
    throw new RunTimeError("randrange range error, upperBound less than lowerBound");
  throw new RunTimeError("not implemented yet");
}


export function time():number{
	return Date.now()%1652000000000;
}

export function sleep(second:number):number{
	const start = time();
	while (time()-start<second*1000);
	return 0;
}
