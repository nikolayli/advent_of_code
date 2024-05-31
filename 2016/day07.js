const fs = require('fs');

function partOne(ips) {
  function hasABBA(str) {
    return str.match(/(\S)((?!\1).)\2\1/);
  }

  function splitOutSections(str) {
    return str.split(/\[.*?\]/);
  }

  function getHypertext(str) {
    return str.match(/\[(.*?)\]/g);
  }

  function isValid(str) {
    return splitOutSections(str).some(hasABBA) &&
            getHypertext(str).every((str) => !hasABBA(str));          
  }

  return ips.filter(isValid).length;
}

function partTwo(ips) {
  function hasABAandBAB(ip) {
    const supernetSequences = ip.split(/\[.*?\]/g);
    const hypernetSequences = ip.match(/\[(.*?)\]/g) || [];

    const abas = [];
    const babs = [];

    for (const sequence of supernetSequences) {
      for (let i = 0; i < sequence.length - 2; i++) {
        if (
          sequence[i] === sequence[i + 2] &&
          sequence[i] !== sequence[i + 1]
        ) {
          abas.push(sequence.slice(i, i + 3));
        }
      }
    }

    for (const sequence of hypernetSequences) {
      for (let i = 0; i < sequence.length - 2; i++) {
        if (
          sequence[i] === sequence[i + 2] &&
          sequence[i] !== sequence[i + 1]
        ) {
          babs.push(sequence.slice(i, i + 3));
        }
      }
    }

    for (const aba of abas) {
      const bab = aba[1] + aba[0] + aba[1];
      if (babs.includes(bab)) {
        return true;
      }
    }

    return false;
  }

  return ips.filter(hasABAandBAB).length;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file: ', err);
    return;
  }

  const ips = data.trim().split('\n');

  const supportTLS = partOne(ips);
  const supportSSL = partTwo(ips);

  console.log('IPs supports TLS: ', supportTLS);
  console.log('IPs supports SSL: ', supportSSL);
});