const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(size) {
      this.size = size;
      this.field = Field.generateField(size);
      this.playerPosition = {x: 0, y: 0};
    }

    static generateField(size) {
      const field = Array(size).fill().map(() => Array(size).fill(fieldCharacter));
      field[0][0] = pathCharacter; // Starting point
  
      // Randomly place the hat
      let hatPlaced = false;
      while (!hatPlaced) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (field[x][y] === fieldCharacter) {
          field[x][y] = hat;
          hatPlaced = true;
        }
      }
  
      // Randomly place holes
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (field[i][j] === fieldCharacter && Math.random() > 0.7) {
            field[i][j] = hole;
          }
        }
      }
  
      return field;
    }

    print() {
        this.field.forEach(row => console.log(row.join('')));
    }

    getInput() {
        const input = prompt('Enter your move (u = up, d = down, l = left, r = right): ');
        return input;
    }

    inBounds() {
        const { x, y } = this.playerPosition;
        return x >= 0 && x < this.field[0].length && y >= 0 && y < this.field.length;
    }

    isHole(position) {
        const {x, y} = position;
        return this.field[y][x] === hole;
    }

    isHat(position) {
        const {x, y} = position;
        return this.field[y][x] === hat;
    }
}

const myField = new Field(Number(process.argv[2]));
myField.print();
while (myField.inBounds(myField.playerPosition)) {
    const input = myField.getInput();
    switch (input) {
        case 'u': myField.playerPosition.y -= 1;
            break;
        case 'd': myField.playerPosition.y += 1;
            break;
        case 'l': myField.playerPosition.x -= 1;
            break;
        case 'r': myField.playerPosition.x += 1;
            break;
        default: console.log('Invalid Input, try again');
            continue;
    }
    if (!myField.inBounds(myField.playerPosition)) {
        console.log('You went out of bounds, D\'oh!');
        break;
    } else if (myField.isHole(myField.playerPosition)) {
        console.log('Oh no - you fell in a hole!');
        break;
    } else if (myField.isHat(myField.playerPosition)) {
        console.log('Congrats, you found your hat!');
        break;
    } else {
        myField.field[myField.playerPosition.y][myField.playerPosition.x] = pathCharacter;
    }
    myField.print();
}