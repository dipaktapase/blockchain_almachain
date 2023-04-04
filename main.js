const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(blocknumber, timestamp, data, previousHash = "") {
    this.blocknumber = blocknumber;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.blocknumber +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data) + 
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
        this.nonce++;
        this.hash = this.calculateHash();
    }
    console.log("Block Mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, "04/04/2023", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock);
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const previousBlock = this.chain[i - 1];
      const currentBlock = this.chain[i];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

const AlmaChain = new Blockchain();

console.log("Mining block 1.....");
AlmaChain.addBlock(new Block(1, "05/04/2023", { amount: 5 }));

console.log("Mining block 2.....");
AlmaChain.addBlock(new Block(2, "05/04/2023", { amount: 10 }));

console.log("Mining block 3.....");
AlmaChain.addBlock(new Block(3, "05/04/2023", { amount: 100 }));

// AlmaChain.chain[1].data = { amount: 100 };
// AlmaChain.chain[1].hash = AlmaChain.chain[1].calculateHash();
// AlmaChain.chain[2].previousHash = AlmaChain.chain[1].hash;
// AlmaChain.chain[2].hash = AlmaChain.chain[2].calculateHash();

console.log(JSON.stringify(AlmaChain, null, 4));
// console.log("Is our chain valid?",AlmaChain.isValid())
