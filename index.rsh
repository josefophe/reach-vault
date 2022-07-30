'reach 0.1';

// import { inherits } from "util";

const countdown = 20;

const shared = {
  showTime: Fun([UInt], Null)
}

export const main = Reach.App(() => {
  const A = Participant('Alice', {
    ...shared,
    inherit: UInt,
    getChoice: Fun([], Bool)
    // Specify Alice's interact interface here
  });
  const B = Participant('Bob', {
    // Specify Bob's interact interface here
    ...shared,
    acceptTerms: Fun([UInt], Bool)
  });
  init();
  A.only(() => {
    const amt = declassify(interact.inherit)
  })
  // The first one to publish deploys the contract
  A.publish(amt)
    .pay(amt);
  commit();

  B.only(() => {
    const terms = declassify(interact.acceptTerms(amt))
  })
  // The second one to publish always attaches
  B.publish(terms);
  commit();
  // write your program here
  each([A, B], () => {
    interact.showTime(countdown);
});
  A.only(() => {
    const stillHere = declassify(interact.getChoice())
  })
  A.publish(stillHere)
  if (stillHere == true) {
    transfer(amt).to(A);
  } else {
    transfer(amt).to(B);
  }

  commit()

  exit();
});