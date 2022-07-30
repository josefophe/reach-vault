import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

/* const [ accAlice, accBob ] =
  await stdlib.newTestAccounts(2, startingBalance); */

const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(6000))
const accBob = await stdlib.newTestAccount(startingBalance)

console.log('Hello, Alice and Bob!');

console.log('Launching...');

const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const shared = () =>({
  showTime: (t) =>{
    console.log(`Time is ${t}`)
  }
})

const choiceArray = ["I’m not here", "I’m still here”"]

const getAccountBalance = async (who) => stdlib.balanceOf(who)

console.log(`Starting account balance of Alice is ${await getAccountBalance(accAlice)}`)
console.log(`Starting account balance of Bob is ${await getAccountBalance(accBob)}`)

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    // implement Alice's interact object here
    ...stdlib.hasRandom,
    ...shared,
    inherit: stdlib.parseCurrency(5000),
    getChoice: () => {
     const choice = Math.floor(Math.random() * 2)
     console.log(`Alice choice is ${choiceArray[choice]}`)
      return choice == 0 ? false : true
    }
  }),

  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    // implement Bob's interact object here
    ...shared,
    acceptTerms: (amount) =>{
      console.log(`Bob accept the terms of The Vault for  ${stdlib.parseCurrency(amount)}`)
      return true
    }
  }),
]);

console.log(`Alice's balance after is: ${await getAccountBalance(accAlice)}`)
console.log(`Bob's account balance after is ${await getAccountBalance(accBob)}`)

console.log('Bye, Alice and Bob!');
