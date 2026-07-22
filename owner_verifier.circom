pragma circom 2.1.0;

include "./node_modules/circomlib/circuits/comparators.circom";

template VerifyOwnerName() {
    signal input myNameHash;
    signal input ownerNameHash;

    signal output isValid;

    component isEq = IsEqual();
    isEq.in[0] <== myNameHash;
    isEq.in[1] <== ownerNameHash;

    isValid <== isEq.out;

    isValid === 1;
}

component main = VerifyOwnerName();
