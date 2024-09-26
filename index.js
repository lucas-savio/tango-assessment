const input_1 = [
  "2021-01-02 COKE 998",
  "2021-01-02 COKE 998",
  "2021-01-03 COKE 998",
  "2021-01-03 FRIES 998",
  "2021-01-03 ICE-CREAM 998",
  "2021-01-10 COKE 101",
  "2021-01-10 FRIES 101",
  "2021-01-11 ICE-CREAM 901",
  "2021-01-12 COKE 998"
];

const input_2 = [
  "2021-01-02 COKE ABC",
  "2021-01-02 COKE DEF",
  "2021-01-03 COKE ABC",
  "2021-01-03 FRIES DEF",
  "2021-01-03 ICE-CREAM ABC",
  "2021-01-10 COKE G12",
  "2021-01-10 ICE-CREAM G12",
  "2021-01-11 FRIES G12",
  "2021-01-12 FRIES DEF"
];

const input_3 = [
  "2021-01-02 COKE G-12",
  "2021-01-11 COKE J-333",
  "2021-01-03 ICE-CREAM J-450",
  "2021-01-12 FRIES G-12",
  "2021-01-10 ICE-CREAM J-450",
  "2021-01-11 FRIES J-333",
  "2021-01-02 FRIES G-12",
  "2021-01-10 ICE-CREAM J-450",
  "2021-01-12 COKE G-12",
  "2021-01-03 FRIES J-133",
  "2021-01-10 COKE J-450"
];

const input_4 = [
  "2021-01-01 FRIES J-333",
  "2021-01-11 COKE J-333",
  "2021-01-11 COKE J-333",
  "2021-01-11 COKE J-333",
  "2021-01-11 FRIES J-333",
  "2021-01-11 FRIES J-333",
  "2021-01-02 FRIES G-12",
  "2021-01-03 ICE-CREAM J-333"
];

const PRICES = {
  "COKE": 5,
  "FRIES": 20,
  "ICE-CREAM": 10,
};

const itemTransaction = (invoiceLine) => {
  const split = invoiceLine.split(" ");
  return {
    item: `${split[0]}_${split[1]}`,
    client: split[2],
  };
};

const itemIsCoke = (item) => item.split('_')[1] === 'COKE';
const itemIsFries = (item) => item.split('_')[1] === 'FRIES';
const itemIsIceCream = (item) => item.split('_')[1] === 'ICE-CREAM';


const calculateClientConsumption = (clientItems) => {
  const counts = {};
  for (const num of clientItems) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  let total = 0
  Object.keys(counts).forEach(c => {
    if (itemIsIceCream(c)) {
      total += counts[c] * PRICES['ICE-CREAM']; // adds + 10
      return;
    }

    if (itemIsFries(c)) {
      total += counts[c] * PRICES['FRIES']; // adds + 20
      return;
    }

    if (itemIsCoke(c)) {
      const date = c.split('_')[0]; // YYYY-MM-DD_ITEM -> ['YYYY-MM-DD', 'ITEM']
      const friesAtSameDay = counts[`${date}_FRIES`];
      if (!!friesAtSameDay) {
         // This returns the smallest count, which also gonna be the max possible bundles to combine
        const maxBundles = Math.min(counts[c], friesAtSameDay);
        total += 1 * maxBundles;
        // Checks if there's a diff between fries and cokes amount at the same day, decides the
        if (maxBundles !== counts[c]) {
          // if there are more fries at the items for the day, the max bundles were already accounted above
          if (friesAtSameDay > counts[c]) return;
          const diff = Math.abs(counts[c] - friesAtSameDay);
          total += diff * PRICES['COKE'];
          return;
        }
        return;
      }
      total += counts[c] * PRICES['COKE']; // adds + 5
      return;
    }
  })

  return total;
};

function main(invoiceLines) {
  const itemTransactionsByClient = invoiceLines
    .map((lines) => itemTransaction(lines))
    .reduce((p, c) => {
      const client = c.client;
      if (!p[client]) {
        return { ...p, [client]: [c.item] };
      }
      return { ...p, [client]: [...p[client], c.item] };
    }, {});

  const clientConsumption = Object.entries(itemTransactionsByClient).map((entries) => {
    const [client, clientItems] = entries;
    return { [client]: calculateClientConsumption(clientItems) };
  });

  const output = {}

  clientConsumption.forEach(c => {
    const entries = Object.entries(c);
    const client = entries[0][0]
    const total = entries[0][1]
    output[client] = total;
  })

  console.log('\n');
  console.log('INPUT:', invoiceLines);
  console.log('\n');
  console.log('-'.repeat(50))
  console.log('\n');
  console.log('OUTPUT:', output);
  console.log('\n');
  console.log('\n');
}

[input_1, input_2, input_3, input_4].map(input => main(input));
